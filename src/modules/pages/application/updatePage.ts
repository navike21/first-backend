import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles, deleteStorageFilesByIds } from '@Modules/storage';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { PageNotFoundError, PageSlugConflictError } from '../domain/errors/PageErrors';
import PageModel from '../infrastructure/PageModel';
import { PAGE_ENTITY_TYPE } from '../constants/paths';
import type { UpdatePageInput } from '../schemas/page.schema';
import type { PageFiles } from './createPage';
import { assertValidParent, cascadeRecomputeFullPath, computeFullPath } from './pageHierarchy';
import { recordPageRevision } from './pageRevisions';

interface UploadedImage {
	field: 'cover' | 'ogImage';
	url: string;
	storageId: string;
}

interface UploadsOutcome {
	warnings: ResponseWarning[];
	uploads: UploadedImage[];
}

async function checkSlugConflict(id: string, slug: UpdatePageInput['slug'], parentId: string | null): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await PageModel.findOne({
		$or: orQuery,
		parentId,
		id: { $ne: id },
		deletedAt: null,
	});
	if (conflict) throw new PageSlugConflictError();
}

async function uploadProvidedFiles(
	id: string,
	files: PageFiles | undefined,
	updatedBy: string | undefined,
): Promise<UploadsOutcome> {
	const warnings: ResponseWarning[] = [];
	const uploads: UploadedImage[] = [];

	for (const field of ['cover', 'ogImage'] as const) {
		const file = files?.[field];
		if (!file) continue;

		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: PAGE_ENTITY_TYPE,
			entityId: id,
			field,
			uploadedBy: updatedBy,
		});
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
async function cleanupReplacedFiles(id: string, uploads: UploadedImage[], clearingOgImage: boolean): Promise<void> {
	for (const upload of uploads) {
		await deleteEntityFiles(PAGE_ENTITY_TYPE, id, { field: upload.field, exceptStorageIds: [upload.storageId] }).catch(
			() => {},
		);
	}
	if (clearingOgImage) {
		await deleteEntityFiles(PAGE_ENTITY_TYPE, id, { field: 'ogImage' }).catch(() => {});
	}
}

async function recomputeOwnFullPath(doc: { slug?: unknown; set: (field: string, value: unknown) => void }, parentId: string | null): Promise<void> {
	let parentFullPath;
	if (parentId) {
		const parent = await PageModel.findOne({ id: parentId, deletedAt: null }).select('fullPath').lean();
		parentFullPath = parent?.fullPath;
	}
	doc.set('fullPath', computeFullPath(doc.slug as never, parentFullPath));
}

export async function updatePage(
	id: string,
	input: UpdatePageInput,
	files: PageFiles | undefined,
	updatedBy: string | undefined,
): Promise<MutationResult<Record<string, unknown>>> {
	const doc = await PageModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const parentIdChanging = input.parentId !== undefined;
	const slugChanging = input.slug !== undefined;
	const effectiveParentId = parentIdChanging ? (input.parentId ?? null) : (doc.parentId ?? null);

	if (parentIdChanging) await assertValidParent(id, effectiveParentId);
	if (input.slug) await checkSlugConflict(id, input.slug, effectiveParentId);

	const { warnings, uploads } = await uploadProvidedFiles(id, files, updatedBy);
	const clearingOgImage = input.seo?.ogImage === '' && !files?.ogImage;

	Object.assign(doc, input);
	applyUploadsToDoc(doc, uploads, clearingOgImage);
	doc.updatedBy = updatedBy;

	if (slugChanging || parentIdChanging) {
		await recomputeOwnFullPath(doc, effectiveParentId);
	}

	try {
		await doc.save();
	} catch (error) {
		const storageIds = uploads.map((u) => u.storageId);
		if (storageIds.length > 0) await deleteStorageFilesByIds(storageIds).catch(() => {});
		throw error;
	}

	await cleanupReplacedFiles(id, uploads, clearingOgImage);

	if (slugChanging || parentIdChanging) {
		await cascadeRecomputeFullPath(id);
	}

	await recordPageRevision(id, doc.toObject(), updatedBy);

	return { data: cleanMongoFields(doc.toObject()), warnings: warnings };
}
