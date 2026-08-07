import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { generateSlug } from '@Helpers/generateSlug';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import type { LocalizedString } from '@Shared/types/localizedString';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import {
	ProductSlugConflictError,
	ProductSkuConflictError,
} from '../domain/errors/ProductErrors';
import ProductModel from '../infrastructure/ProductModel';
import { PRODUCT_ENTITY_TYPE } from '../constants/paths';
import type {
	CreateProductInput,
	VariantInput,
} from '../schemas/product.schema';

function resolveSlug(input: CreateProductInput): LocalizedString {
	return Object.fromEntries(
		SUPPORTED_LANGUAGES.map((l) => [
			l,
			input.slug?.[l]?.trim() || generateSlug(input.name[l] ?? ''),
		]),
	) as LocalizedString;
}

async function checkSlugConflict(slug: LocalizedString): Promise<void> {
	const entries = Object.entries(slug).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await ProductModel.findOne({ $or: orQuery });
	if (existing) throw new ProductSlugConflictError();
}

async function checkSkuConflict(sku: string | undefined): Promise<void> {
	if (!sku?.trim()) return;
	const existing = await ProductModel.findOne({ sku, deletedAt: null });
	if (existing) throw new ProductSkuConflictError();
}

/** Every new variant gets a fresh id — on create, nothing pre-exists to preserve. */
function assignVariantIds(variants: VariantInput[]): VariantInput[] {
	return variants.map((v) => ({ ...v, id: v.id ?? generateUUID() }));
}

export async function createProduct(
	input: CreateProductInput,
	uploadedBy?: string,
	galleryFiles: IncomingFile[] = [],
): Promise<MutationResult<Record<string, unknown>>> {
	const slug = resolveSlug(input);
	await checkSlugConflict(slug);
	await checkSkuConflict(input.sku);

	const id = generateUUID();
	const warnings: ResponseWarning[] = [];

	const galleryUploads = await Promise.all(
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
	const uploadedGallery: string[] = [];
	for (const uploaded of galleryUploads) {
		if (uploaded.url) uploadedGallery.push(uploaded.url);
		if (uploaded.warning) warnings.push(uploaded.warning);
	}
	const gallery = [...(input.gallery ?? []), ...uploadedGallery];

	try {
		const product = await ProductModel.create({
			...input,
			id,
			slug,
			gallery,
			variants: assignVariantIds(input.variants ?? []),
		});
		return {
			data: cleanMongoFields(
				product.toObject({ versionKey: false, getters: true }),
			),
			warnings,
		};
	} catch (error) {
		if (galleryFiles.length) {
			await deleteEntityFiles(PRODUCT_ENTITY_TYPE, id).catch(() => {});
		}
		throw error;
	}
}
