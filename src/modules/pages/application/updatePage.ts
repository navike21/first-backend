import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles, deleteStorageFilesByIds } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { PageNotFoundError, PageSlugConflictError } from '../domain/errors/PageErrors';
import PageModel from '../infrastructure/PageModel';
import { PAGE_ENTITY_TYPE } from '../constants/paths';
import type { UpdatePageInput } from '../schemas/page.schema';
import { assertValidParent, cascadeRecomputeFullPath, computeFullPath } from './pageHierarchy';
import { recordPageRevision } from './pageRevisions';

interface UploadOutcome {
	warnings: ResponseWarning[];
	coverImageUrl?: string;
	storageId?: string;
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

async function uploadCoverIfProvided(
	id: string,
	file: IncomingFile | undefined,
	updatedBy: string | undefined,
): Promise<UploadOutcome> {
	if (!file) return { warnings: [] };

	const uploaded = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: PAGE_ENTITY_TYPE,
		entityId: id,
		field: 'cover',
		uploadedBy: updatedBy,
	});
	const warnings = uploaded.warning ? [uploaded.warning] : [];
	if (uploaded.url && uploaded.storageId) {
		return { warnings, coverImageUrl: uploaded.url, storageId: uploaded.storageId };
	}
	return { warnings };
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
	file: IncomingFile | undefined,
	updatedBy: string | undefined,
): Promise<MutationResult<Record<string, unknown>>> {
	const doc = await PageModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const parentIdChanging = input.parentId !== undefined;
	const slugChanging = input.slug !== undefined;
	const effectiveParentId = parentIdChanging ? (input.parentId ?? null) : (doc.parentId ?? null);

	if (parentIdChanging) await assertValidParent(id, effectiveParentId);
	if (input.slug) await checkSlugConflict(id, input.slug, effectiveParentId);

	const upload = await uploadCoverIfProvided(id, file, updatedBy);

	Object.assign(doc, input, upload.coverImageUrl ? { coverImageUrl: upload.coverImageUrl } : {});
	doc.updatedBy = updatedBy;

	if (slugChanging || parentIdChanging) {
		await recomputeOwnFullPath(doc, effectiveParentId);
	}

	try {
		await doc.save();
	} catch (error) {
		if (upload.storageId) await deleteStorageFilesByIds([upload.storageId]).catch(() => {});
		throw error;
	}

	if (upload.storageId) {
		await deleteEntityFiles(PAGE_ENTITY_TYPE, id, { exceptStorageIds: [upload.storageId] }).catch(() => {});
	}
	if (slugChanging || parentIdChanging) {
		await cascadeRecomputeFullPath(id);
	}

	await recordPageRevision(id, doc.toObject(), updatedBy);

	return { data: cleanMongoFields(doc.toObject()), warnings: upload.warnings };
}
