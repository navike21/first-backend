import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { generateSlug } from '@Helpers/generateSlug';
import { AppError } from '@Shared/domain/AppError';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { PortfolioSlugConflictError } from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';
import { PORTFOLIO_ENTITY_TYPE } from '../constants/paths';
import type { CreatePortfolioInput } from '../schemas/portfolio.schema';

export async function createPortfolio(
	input: CreatePortfolioInput,
	file?: IncomingFile,
	uploadedBy?: string,
	galleryFiles: IncomingFile[] = [],
): Promise<MutationResult<Record<string, unknown>>> {
	const slug = input.slug ?? generateSlug(input.name.en);

	const existing = await PortfolioModel.findOne({ slug });
	if (existing) throw new PortfolioSlugConflictError();

	const id = generateUUID();
	let coverImageUrl = input.coverImageUrl;
	const warnings: ResponseWarning[] = [];

	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: PORTFOLIO_ENTITY_TYPE,
			entityId: id,
			field: 'cover',
			uploadedBy,
		});
		if (uploaded.url) coverImageUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	// The cover is required: it must come from a successful upload or a URL.
	if (!coverImageUrl) {
		AppError.unprocessable(
			'PORTFOLIO_COVER_REQUIRED',
			'A cover image is required',
		);
	}

	// Nothing pre-exists on create, so the gallery is entirely whatever was
	// just uploaded, in the order the files arrived.
	const galleryUploads = await Promise.all(
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
	const gallery: string[] = [];
	for (const uploaded of galleryUploads) {
		if (uploaded.url) gallery.push(uploaded.url);
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	try {
		const portfolio = await PortfolioModel.create({
			...input,
			id,
			slug,
			coverImageUrl,
			gallery,
		});
		return {
			data: cleanMongoFields(
				portfolio.toObject({ versionKey: false, getters: true }),
			),
			warnings,
		};
	} catch (error) {
		if (file || galleryFiles.length) {
			await deleteEntityFiles(PORTFOLIO_ENTITY_TYPE, id).catch(() => {});
		}
		throw error;
	}
}
