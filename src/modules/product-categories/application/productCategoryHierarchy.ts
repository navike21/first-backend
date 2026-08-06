import ProductCategoryModel from '../infrastructure/ProductCategoryModel';
import {
	ProductCategoryInvalidParentError,
	ProductCategoryParentNotFoundError,
} from '../domain/errors/ProductCategoryErrors';

interface ProductCategoryParentFields {
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
	if (newParentId === categoryId) throw new ProductCategoryInvalidParentError();

	let currentId: string | null = newParentId;
	const visited = new Set<string>();

	while (currentId) {
		if (currentId === categoryId) throw new ProductCategoryInvalidParentError();
		if (visited.has(currentId)) throw new ProductCategoryInvalidParentError();
		visited.add(currentId);

		const parent: ProductCategoryParentFields | null =
			await ProductCategoryModel.findOne({
				id: currentId,
				deletedAt: null,
			})
				.select('id parentId')
				.lean();
		if (!parent) {
			if (currentId === newParentId)
				throw new ProductCategoryParentNotFoundError();
			throw new ProductCategoryInvalidParentError();
		}
		currentId = parent.parentId ?? null;
	}
}
