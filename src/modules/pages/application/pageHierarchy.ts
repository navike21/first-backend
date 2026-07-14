import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import type { LocalizedString } from '@Shared/types/localizedString';
import PageModel from '../infrastructure/PageModel';
import {
	PageInvalidParentError,
	PageParentNotFoundError,
} from '../domain/errors/PageErrors';

interface PageParentFields {
	id: string;
	parentId?: string | null;
}

/**
 * Prevents a page from becoming its own ancestor. Walks the candidate parent's
 * chain upward; if it ever reaches `pageId` (or the candidate parent doesn't
 * exist), the move is rejected. `pageId` is undefined when creating a page
 * (nothing to cycle back to yet).
 */
export async function assertValidParent(
	pageId: string | undefined,
	newParentId: string | null | undefined,
): Promise<void> {
	if (!newParentId) return;
	if (newParentId === pageId) throw new PageInvalidParentError();

	let currentId: string | null = newParentId;
	const visited = new Set<string>();

	while (currentId) {
		if (currentId === pageId) throw new PageInvalidParentError();
		if (visited.has(currentId)) throw new PageInvalidParentError();
		visited.add(currentId);

		const parent: PageParentFields | null = await PageModel.findOne({
			id: currentId,
			deletedAt: null,
		})
			.select('id parentId')
			.lean();
		if (!parent) {
			if (currentId === newParentId) throw new PageParentNotFoundError();
			throw new PageInvalidParentError();
		}
		currentId = parent.parentId ?? null;
	}
}

function joinPathSegment(parentSegment: string, ownSegment: string): string {
	if (!ownSegment) return '';
	if (!parentSegment) return ownSegment;
	return `${parentSegment}/${ownSegment}`;
}

type MaybeLocalized =
	| Record<string, string | null | undefined>
	| null
	| undefined;

export function computeFullPath(
	slug: MaybeLocalized,
	parentFullPath: MaybeLocalized,
): LocalizedString {
	const result = {} as LocalizedString;
	for (const lang of SUPPORTED_LANGUAGES) {
		result[lang] = joinPathSegment(
			parentFullPath?.[lang] ?? '',
			slug?.[lang] ?? '',
		);
	}
	return result;
}

interface PageWithPathFields {
	id: string;
	slug?: MaybeLocalized;
	fullPath?: MaybeLocalized;
}

/**
 * Recomputes and persists `fullPath` for every descendant of `pageId`, in
 * breadth-first order, using each ancestor's freshly-saved `fullPath`. Called
 * after a page's own slug or parent changes, since its descendants' composed
 * paths depend on it.
 */
export async function cascadeRecomputeFullPath(pageId: string): Promise<void> {
	let frontier = [pageId];

	while (frontier.length > 0) {
		const children: PageWithPathFields[] = await PageModel.find({
			parentId: { $in: frontier },
			deletedAt: null,
		})
			.select('id slug fullPath parentId')
			.lean();
		if (children.length === 0) return;

		const parents: PageWithPathFields[] = await PageModel.find({
			id: { $in: frontier },
		})
			.select('id fullPath')
			.lean();
		const parentPathById = new Map(parents.map((p) => [p.id, p.fullPath]));

		await Promise.all(
			children.map((child) => {
				const parentId = (child as unknown as { parentId?: string }).parentId;
				const fullPath = computeFullPath(
					child.slug,
					parentId ? parentPathById.get(parentId) : undefined,
				);
				return PageModel.updateOne({ id: child.id }, { $set: { fullPath } });
			}),
		);

		frontier = children.map((c) => c.id);
	}
}
