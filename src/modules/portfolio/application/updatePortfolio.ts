import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
	listEntityFiles,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import {
	PortfolioNotFoundError,
	PortfolioSlugConflictError,
} from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';
import { PORTFOLIO_ENTITY_TYPE } from '../constants/paths';
import type { GalleryOrderToken, UpdatePortfolioInput } from '../schemas/portfolio.schema';

/** Persists the document, compensating (deleting) any freshly uploaded files if the save fails. */
async function saveOrCompensate(
	portfolio: { save: () => Promise<unknown> },
	uploadedStorageIds: string[],
): Promise<void> {
	try {
		await portfolio.save();
	} catch (error) {
		if (uploadedStorageIds.length) {
			await deleteStorageFilesByIds(uploadedStorageIds).catch(() => {});
		}
		throw error;
	}
}

interface GalleryReconciliation {
	finalGallery: string[];
	newGalleryStorageIds: string[];
	warnings: ResponseWarning[];
}

/** Uploads newly picked gallery files and resolves `galleryOrder` tokens (existing + new, interleaved) into the final URL list. */
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
				entityType: PORTFOLIO_ENTITY_TYPE,
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

interface CoverUpload {
	uploadedUrl?: string;
	newStorageId?: string;
	warning?: ResponseWarning;
}

/** Uploads a replacement cover file, if one was provided. */
async function uploadCoverIfProvided(
	id: string,
	uploadedBy: string | undefined,
	file?: IncomingFile,
): Promise<CoverUpload> {
	if (!file) return {};
	const uploaded = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: PORTFOLIO_ENTITY_TYPE,
		entityId: id,
		field: 'cover',
		uploadedBy,
	});
	return {
		uploadedUrl: uploaded.url,
		newStorageId: uploaded.storageId,
		warning: uploaded.warning,
	};
}

/** Deletes stored gallery files that are no longer part of the final gallery. */
async function removeDroppedGalleryFiles(id: string, finalGallery: string[]): Promise<void> {
	const keptUrls = new Set(finalGallery);
	const currentGalleryFiles = await listEntityFiles(PORTFOLIO_ENTITY_TYPE, id, {
		field: 'gallery',
	});
	const toRemove = currentGalleryFiles.filter(
		(storageFile) => !keptUrls.has(storageFile.full?.url ?? storageFile.original.url),
	);
	if (toRemove.length) {
		await deleteStorageFilesByIds(toRemove.map((storageFile) => storageFile.id)).catch(() => {});
	}
}

export async function updatePortfolio(
	id: string,
	input: UpdatePortfolioInput,
	file?: IncomingFile,
	uploadedBy?: string,
	galleryFiles: IncomingFile[] = [],
): Promise<MutationResult<Record<string, unknown>>> {
	const portfolio = await PortfolioModel.findOne({
		id,
		deletedAt: null,
	});
	if (!portfolio) throw new PortfolioNotFoundError();

	if (input.slug) {
		const conflict = await PortfolioModel.findOne({
			slug: input.slug,
			id: { $ne: id },
		});
		if (conflict) throw new PortfolioSlugConflictError();
	}

	const warnings: ResponseWarning[] = [];
	const { uploadedUrl, newStorageId, warning: coverWarning } = await uploadCoverIfProvided(
		id,
		uploadedBy,
		file,
	);
	if (coverWarning) warnings.push(coverWarning);

	// Gallery is only reconciled when the client explicitly sent `galleryOrder`
	// (i.e. touched the gallery); omitting it leaves the existing gallery as-is,
	// same semantics as omitting `cover`.
	let finalGallery: string[] | undefined;
	let newGalleryStorageIds: string[] = [];

	if (input.galleryOrder) {
		const reconciled = await reconcileGallery(
			id,
			uploadedBy,
			galleryFiles,
			input.galleryOrder,
			new Set(portfolio.gallery),
		);
		finalGallery = reconciled.finalGallery;
		newGalleryStorageIds = reconciled.newGalleryStorageIds;
		warnings.push(...reconciled.warnings);
	}

	Object.assign(
		portfolio,
		input,
		uploadedUrl ? { coverImageUrl: uploadedUrl } : {},
		finalGallery ? { gallery: finalGallery } : {},
	);

	await saveOrCompensate(portfolio, [
		...(newStorageId ? [newStorageId] : []),
		...newGalleryStorageIds,
	]);

	if (newStorageId) {
		await deleteEntityFiles(PORTFOLIO_ENTITY_TYPE, id, {
			field: 'cover',
			exceptStorageIds: [newStorageId],
		}).catch(() => {});
	}

	if (finalGallery) {
		await removeDroppedGalleryFiles(id, finalGallery);
	}

	return {
		data: cleanMongoFields(
			portfolio.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
