import CategoryModel from '../infrastructure/CategoryModel';
import { CategoryInvalidParentError, CategoryParentNotFoundError } from '../domain/errors/CategoryErrors';

interface CategoryParentFields {
	id: string;
	parentId?: string | null;
}

/**
 * Prevents a category from becoming its own ancestor. Walks the candidate
 * parent's chain upward; if it ever reaches `categoryId` (or the candidate
 * doesn't exist), the move is rejected. `categoryId` is undefined when
 * creating a category (nothing to cycle back to yet).
 */
export async function assertValidParent(
	categoryId: string | undefined,
	newParentId: string | null | undefined,
): Promise<void> {
	if (!newParentId) return;
	if (newParentId === categoryId) throw new CategoryInvalidParentError();

	let currentId: string | null = newParentId;
	const visited = new Set<string>();

	while (currentId) {
		if (currentId === categoryId) throw new CategoryInvalidParentError();
		if (visited.has(currentId)) throw new CategoryInvalidParentError();
		visited.add(currentId);

		const parent: CategoryParentFields | null = await CategoryModel.findOne({ id: currentId, deletedAt: null })
			.select('id parentId')
			.lean();
		if (!parent) {
			if (currentId === newParentId) throw new CategoryParentNotFoundError();
			throw new CategoryInvalidParentError();
		}
		currentId = parent.parentId ?? null;
	}
}
