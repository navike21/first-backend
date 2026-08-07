import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	uploadImageSafe,
	deleteStorageFilesByIds,
	listEntityFiles,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import {
	ProductNotFoundError,
	ProductSlugConflictError,
	ProductSkuConflictError,
} from '../domain/errors/ProductErrors';
import ProductModel from '../infrastructure/ProductModel';
import { PRODUCT_ENTITY_TYPE } from '../constants/paths';
import type {
	GalleryOrderToken,
	UpdateProductInput,
	VariantInput,
} from '../schemas/product.schema';

async function checkSlugConflict(
	id: string,
	slug?: UpdateProductInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await ProductModel.findOne({
		$or: orQuery,
		id: { $ne: id },
	});
	if (conflict) throw new ProductSlugConflictError();
}

async function checkSkuConflict(id: string, sku?: string): Promise<void> {
	if (!sku?.trim()) return;
	const conflict = await ProductModel.findOne({
		sku,
		deletedAt: null,
		id: { $ne: id },
	});
	if (conflict) throw new ProductSkuConflictError();
}

/** Preserves an existing variant's `id` when the client sent one that still
 * matches a variant on the document — a new variant (no id, or an id that no
 * longer exists) gets a fresh one. Keeps `inventory.Stock` rows (keyed by
 * productId+variantId) pointing at the right row across an edit. */
function reconcileVariantIds(
	incoming: VariantInput[],
	existingIds: Set<string>,
): VariantInput[] {
	return incoming.map((v) => ({
		...v,
		id: v.id && existingIds.has(v.id) ? v.id : generateUUID(),
	}));
}

interface GalleryReconciliation {
	finalGallery: string[];
	newGalleryStorageIds: string[];
	warnings: ResponseWarning[];
}

async function reconcileGallery(
	id: string,
	uploadedBy: string | undefined,
	galleryFiles: IncomingFile[],
	galleryOrder: GalleryOrderToken[],
	existingGalleryUrls: Set<string>,
): Promise<GalleryReconciliation> {
	const warnings: ResponseWarning[] = [];
	const urlByIndex = new Map<number, string>();
	const newGalleryStorageIds: string[] = [];

	const uploadResults = await Promise.all(
		galleryFiles.map((galleryFile) =>
			uploadImageSafe({
				buffer: galleryFile.buffer,
				originalName: galleryFile.originalName,
				mimeType: galleryFile.mimeType,
				entityType: PRODUCT_ENTITY_TYPE,
				entityId: id,
				field: 'gallery',
				uploadedBy,
			}),
		),
	);
	uploadResults.forEach((uploaded, index) => {
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			urlByIndex.set(index, uploaded.url);
			newGalleryStorageIds.push(uploaded.storageId);
		}
	});

	const finalGallery: string[] = [];
	for (const token of galleryOrder) {
		if (token.type === 'existing') {
			if (existingGalleryUrls.has(token.url)) finalGallery.push(token.url);
		} else if (urlByIndex.has(token.index)) {
			finalGallery.push(urlByIndex.get(token.index) as string);
		}
	}

	return { finalGallery, newGalleryStorageIds, warnings };
}

async function removeDroppedGalleryFiles(
	id: string,
	finalGallery: string[],
): Promise<void> {
	const keptUrls = new Set(finalGallery);
	const currentGalleryFiles = await listEntityFiles(PRODUCT_ENTITY_TYPE, id, {
		field: 'gallery',
	});
	const toRemove = currentGalleryFiles.filter(
		(storageFile) =>
			!keptUrls.has(storageFile.full?.url ?? storageFile.original.url),
	);
	if (toRemove.length) {
		await deleteStorageFilesByIds(
			toRemove.map((storageFile) => storageFile.id),
		).catch(() => {});
	}
}

export async function updateProduct(
	id: string,
	input: UpdateProductInput,
	uploadedBy?: string,
	galleryFiles: IncomingFile[] = [],
): Promise<MutationResult<Record<string, unknown>>> {
	const product = await ProductModel.findOne({ id, deletedAt: null });
	if (!product) throw new ProductNotFoundError();

	await checkSlugConflict(id, input.slug);
	await checkSkuConflict(id, input.sku);

	const warnings: ResponseWarning[] = [];

	let finalGallery: string[] | undefined;
	let newGalleryStorageIds: string[] = [];
	if (input.galleryOrder) {
		const reconciled = await reconcileGallery(
			id,
			uploadedBy,
			galleryFiles,
			input.galleryOrder,
			new Set(product.gallery),
		);
		finalGallery = reconciled.finalGallery;
		newGalleryStorageIds = reconciled.newGalleryStorageIds;
		warnings.push(...reconciled.warnings);
	}

	const { variants, ...rest } = input;
	const existingVariantIds = new Set(product.variants.map((v) => v.id));

	// `rest` may still carry `galleryOrder` — harmless, Mongoose's default
	// strict mode drops any key that isn't part of the schema on save (same
	// as portfolio's equivalent `Object.assign(portfolio, input, ...)`).
	Object.assign(
		product,
		rest,
		variants
			? { variants: reconcileVariantIds(variants, existingVariantIds) }
			: {},
		finalGallery ? { gallery: finalGallery } : {},
	);

	try {
		await product.save();
	} catch (error) {
		if (newGalleryStorageIds.length) {
			await deleteStorageFilesByIds(newGalleryStorageIds).catch(() => {});
		}
		throw error;
	}

	if (finalGallery) {
		await removeDroppedGalleryFiles(id, finalGallery);
	}

	return {
		data: cleanMongoFields(
			product.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
