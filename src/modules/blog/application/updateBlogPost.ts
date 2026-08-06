import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles, deleteStorageFilesByIds } from '@Modules/storage';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import {
	BlogNotFoundError,
	BlogSlugConflictError,
} from '../domain/errors/BlogErrors';
import BlogModel from '../infrastructure/BlogModel';
import { BLOG_ENTITY_TYPE } from '../constants/paths';
import { uploadBlogImage } from './blogImageUpload';
import type { UpdateBlogInput } from '../schemas/blog.schema';
import type { BlogPostFiles } from './createBlogPost';

interface UploadedImage {
	field: 'cover' | 'ogImage';
	url: string;
	storageId: string;
}

interface UploadsOutcome {
	warnings: ResponseWarning[];
	uploads: UploadedImage[];
}

async function checkSlugConflict(
	id: string,
	slug: UpdateBlogInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await BlogModel.findOne({
		$or: orQuery,
		id: { $ne: id },
	});
	if (conflict) throw new BlogSlugConflictError();
}

async function uploadProvidedFiles(
	id: string,
	files: BlogPostFiles | undefined,
	updatedBy: string | undefined,
): Promise<UploadsOutcome> {
	const warnings: ResponseWarning[] = [];
	const uploads: UploadedImage[] = [];

	for (const field of ['cover', 'ogImage'] as const) {
		const file = files?.[field];
		if (!file) continue;

		const uploaded = await uploadBlogImage(id, field, file, updatedBy);
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			uploads.push({ field, url: uploaded.url, storageId: uploaded.storageId });
		}
	}

	return { warnings, uploads };
}

function applyUploadsToDoc(
	doc: { set: (field: string, value: unknown) => void },
	uploads: UploadedImage[],
	clearingOgImage: boolean,
): void {
	for (const upload of uploads) {
		if (upload.field === 'cover') doc.set('coverImageUrl', upload.url);
		else doc.set('seo.ogImage', upload.url);
	}
	if (clearingOgImage) doc.set('seo.ogImage', undefined);
}

// Replacements are scoped per field so swapping the cover never wipes the
// og image blobs (and vice versa).
async function cleanupReplacedFiles(
	id: string,
	uploads: UploadedImage[],
	clearingOgImage: boolean,
): Promise<void> {
	for (const upload of uploads) {
		await deleteEntityFiles(BLOG_ENTITY_TYPE, id, {
			field: upload.field,
			exceptStorageIds: [upload.storageId],
		}).catch(() => {});
	}
	if (clearingOgImage) {
		await deleteEntityFiles(BLOG_ENTITY_TYPE, id, { field: 'ogImage' }).catch(
			() => {},
		);
	}
}

export async function updateBlogPost(
	id: string,
	input: UpdateBlogInput,
	files: BlogPostFiles | undefined,
	updatedBy: string | undefined,
): Promise<MutationResult<Record<string, unknown>>> {
	const doc = await BlogModel.findOne({ id, deletedAt: null });
	if (!doc) throw new BlogNotFoundError();

	if (input.slug) await checkSlugConflict(id, input.slug);

	const { warnings, uploads } = await uploadProvidedFiles(id, files, updatedBy);
	const clearingOgImage = input.seo?.ogImage === '' && !files?.ogImage;

	Object.assign(doc, input);
	applyUploadsToDoc(doc, uploads, clearingOgImage);

	try {
		await doc.save();
	} catch (error) {
		const storageIds = uploads.map((u) => u.storageId);
		if (storageIds.length > 0)
			await deleteStorageFilesByIds(storageIds).catch(() => {});
		throw error;
	}

	await cleanupReplacedFiles(id, uploads, clearingOgImage);

	return {
		data: cleanMongoFields(
			doc.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
