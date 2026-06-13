import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import {
	ServiceNotFoundError,
	ServiceSlugConflictError,
} from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';
import { SERVICE_ENTITY_TYPE } from '../constants/paths';
import type { UpdateServiceInput } from '../schemas/service.schema';

export async function updateService(
	id: string,
	input: UpdateServiceInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const service = await ServiceModel.findOne({ id, status: 'active' });
	if (!service) throw new ServiceNotFoundError();

	if (input.slug) {
		const conflict = await ServiceModel.findOne({
			slug: input.slug,
			id: { $ne: id },
		});
		if (conflict) throw new ServiceSlugConflictError();
	}

	const warnings: ResponseWarning[] = [];
	let uploadedUrl: string | undefined;
	let newStorageId: string | undefined;

	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: SERVICE_ENTITY_TYPE,
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
		service,
		input,
		uploadedUrl ? { coverImageUrl: uploadedUrl } : {},
	);

	try {
		await service.save();
	} catch (error) {
		if (newStorageId) {
			await deleteStorageFilesByIds([newStorageId]).catch(() => {});
		}
		throw error;
	}

	if (newStorageId) {
		await deleteEntityFiles(SERVICE_ENTITY_TYPE, id, {
			exceptStorageIds: [newStorageId],
		}).catch(() => {});
	}

	return {
		data: cleanMongoFields(
			service.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
