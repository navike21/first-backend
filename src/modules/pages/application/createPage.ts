import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { PageSlugConflictError } from '../domain/errors/PageErrors';
import PageModel from '../infrastructure/PageModel';
import { PAGE_ENTITY_TYPE } from '../constants/paths';
import type { CreatePageInput } from '../schemas/page.schema';
import { assertValidParent, computeFullPath } from './pageHierarchy';
import { recordPageRevision } from './pageRevisions';

export interface PageFiles {
	cover?: IncomingFile;
	ogImage?: IncomingFile;
}

async function checkSlugConflict(
	slug: CreatePageInput['slug'],
	parentId?: string | null,
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await PageModel.findOne({
		$or: orQuery,
		parentId: parentId ?? null,
		deletedAt: null,
	});
	if (existing) throw new PageSlugConflictError();
}

async function uploadPageImage(
	id: string,
	field: 'cover' | 'ogImage',
	file: IncomingFile,
	uploadedBy: string | undefined,
	warnings: ResponseWarning[],
): Promise<string | undefined> {
	const uploaded = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: PAGE_ENTITY_TYPE,
		entityId: id,
		field,
		uploadedBy,
	});
	if (uploaded.warning) warnings.push(uploaded.warning);
	return uploaded.url;
}

export async function createPage(
	input: CreatePageInput,
	files: PageFiles | undefined,
	createdBy: string | undefined,
): Promise<MutationResult<Record<string, unknown>>> {
	await assertValidParent(undefined, input.parentId);
	await checkSlugConflict(input.slug, input.parentId);

	const id = generateUUID();
	let coverImageUrl = input.coverImageUrl;
	// '' means "no image" on create — normalize so the document never stores ''.
	let seo =
		input.seo?.ogImage === ''
			? { ...input.seo, ogImage: undefined }
			: input.seo;
	const warnings: ResponseWarning[] = [];

	if (files?.cover) {
		const url = await uploadPageImage(
			id,
			'cover',
			files.cover,
			createdBy,
			warnings,
		);
		if (url) coverImageUrl = url;
	}
	if (files?.ogImage) {
		const url = await uploadPageImage(
			id,
			'ogImage',
			files.ogImage,
			createdBy,
			warnings,
		);
		if (url) seo = { ...(seo ?? {}), ogImage: url };
	}

	let parentFullPath;
	if (input.parentId) {
		const parent = await PageModel.findOne({
			id: input.parentId,
			deletedAt: null,
		})
			.select('fullPath')
			.lean();
		parentFullPath = parent?.fullPath;
	}
	const fullPath = computeFullPath(input.slug, parentFullPath);

	try {
		const doc = await PageModel.create({
			...input,
			id,
			coverImageUrl,
			seo,
			fullPath,
			createdBy,
			updatedBy: createdBy,
		});
		await recordPageRevision(id, doc.toObject(), createdBy);
		return { data: cleanMongoFields(doc.toObject()), warnings };
	} catch (error) {
		if (files?.cover || files?.ogImage) {
			await deleteEntityFiles(PAGE_ENTITY_TYPE, id).catch(() => {});
		}
		throw error;
	}
}
