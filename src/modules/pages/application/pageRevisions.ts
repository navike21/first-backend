import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PageModel from '../infrastructure/PageModel';
import PageRevisionModel from '../infrastructure/PageRevisionModel';
import { PageNotFoundError, PageRevisionNotFoundError, PageSlugConflictError } from '../domain/errors/PageErrors';
import { assertValidParent, cascadeRecomputeFullPath, computeFullPath } from './pageHierarchy';

const SNAPSHOT_FIELDS = [
	'title',
	'description',
	'slug',
	'coverImageUrl',
	'seo',
	'parentId',
	'status',
	'scheduledAt',
	'categoryIds',
	'tagIds',
	'sections',
] as const;

export async function recordPageRevision(
	pageId: string,
	snapshot: Record<string, unknown>,
	createdBy: string | undefined,
): Promise<void> {
	await PageRevisionModel.create({
		pageId,
		snapshot: cleanMongoFields(snapshot),
		createdBy,
	});
}

export async function listPageRevisions(pageId: string) {
	const page = await PageModel.findOne({ id: pageId }).lean();
	if (!page) throw new PageNotFoundError();

	const revisions = await PageRevisionModel.find({ pageId }).sort({ createdAt: -1 }).lean();
	return revisions.map(cleanMongoFields);
}

async function checkSlugConflict(pageId: string, slug: unknown, parentId: unknown): Promise<void> {
	const entries = Object.entries((slug as Record<string, string>) ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await PageModel.findOne({
		$or: orQuery,
		parentId: (parentId as string | null | undefined) ?? null,
		id: { $ne: pageId },
		deletedAt: null,
	});
	if (existing) throw new PageSlugConflictError();
}

export async function restorePageRevision(pageId: string, revisionId: string, restoredBy: string | undefined) {
	const doc = await PageModel.findOne({ id: pageId, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const revision = await PageRevisionModel.findOne({ id: revisionId, pageId }).lean();
	if (!revision) throw new PageRevisionNotFoundError();

	const snapshot = revision.snapshot as Record<string, unknown>;
	const restoredParentId = (snapshot.parentId as string | null | undefined) ?? null;

	await assertValidParent(pageId, restoredParentId);
	await checkSlugConflict(pageId, snapshot.slug, restoredParentId);

	for (const field of SNAPSHOT_FIELDS) {
		if (field in snapshot) (doc as unknown as Record<string, unknown>)[field] = snapshot[field];
	}
	doc.updatedBy = restoredBy;

	let parentFullPath;
	if (restoredParentId) {
		const parent = await PageModel.findOne({ id: restoredParentId, deletedAt: null }).select('fullPath').lean();
		parentFullPath = parent?.fullPath;
	}
	doc.set('fullPath', computeFullPath(snapshot.slug as never, parentFullPath));

	await doc.save();
	await cascadeRecomputeFullPath(pageId);
	await recordPageRevision(pageId, doc.toObject(), restoredBy);

	return cleanMongoFields(doc.toObject());
}
