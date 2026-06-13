import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import {
	PortfolioNotFoundError,
	PortfolioSlugConflictError,
} from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';
import { PORTFOLIO_ENTITY_TYPE } from '../constants/paths';
import type { UpdatePortfolioInput } from '../schemas/portfolio.schema';

export async function updatePortfolio(
	id: string,
	input: UpdatePortfolioInput,
	file?: IncomingFile,
	uploadedBy?: string,
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
	let uploadedUrl: string | undefined;
	let newStorageId: string | undefined;

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
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			uploadedUrl = uploaded.url;
			newStorageId = uploaded.storageId;
		}
	}

	Object.assign(
		portfolio,
		input,
		uploadedUrl ? { coverImageUrl: uploadedUrl } : {},
	);

	try {
		await portfolio.save();
	} catch (error) {
		if (newStorageId) {
			await deleteStorageFilesByIds([newStorageId]).catch(() => {});
		}
		throw error;
	}

	if (newStorageId) {
		await deleteEntityFiles(PORTFOLIO_ENTITY_TYPE, id, {
			exceptStorageIds: [newStorageId],
		}).catch(() => {});
	}

	return {
		data: cleanMongoFields(
			portfolio.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
