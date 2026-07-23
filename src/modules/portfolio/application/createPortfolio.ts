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

interface CoverResolution {
	coverImageUrl: string;
	warning?: ResponseWarning;
}

/**
 * Resolves the cover for a new portfolio: uploads `file` if provided, else
 * falls back to `inputUrl`. The cover is required, so this throws when
 * neither yields one — with a distinct code when a file WAS provided but
 * `uploadImageSafe` (which never throws, only warns) couldn't process it,
 * so the real reason surfaces instead of a generic "missing cover" message
 * for something the user did send.
 */
async function resolveCoverOrThrow(
	id: string,
	inputUrl: string | undefined,
	file: IncomingFile | undefined,
	uploadedBy: string | undefined,
): Promise<CoverResolution> {
	if (!file) {
		if (inputUrl) return { coverImageUrl: inputUrl };
		AppError.unprocessable(
			'PORTFOLIO_COVER_REQUIRED',
			'A cover image is required',
		);
	}

	const uploaded = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: PORTFOLIO_ENTITY_TYPE,
		entityId: id,
		field: 'cover',
		uploadedBy,
	});
	if (uploaded.url) return { coverImageUrl: uploaded.url, warning: uploaded.warning };

	if (uploaded.warning) {
		AppError.unprocessable(
			'PORTFOLIO_COVER_UPLOAD_FAILED',
			uploaded.warning.message,
			uploaded.warning,
		);
	}
	AppError.unprocessable(
		'PORTFOLIO_COVER_REQUIRED',
		'A cover image is required',
	);
}

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
	const warnings: ResponseWarning[] = [];

	const cover = await resolveCoverOrThrow(
		id,
		input.coverImageUrl,
		file,
		uploadedBy,
	);
	const coverImageUrl = cover.coverImageUrl;
	if (cover.warning) warnings.push(cover.warning);

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
