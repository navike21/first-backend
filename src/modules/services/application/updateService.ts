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

interface ServiceFiles {
	cover?: IncomingFile;
	icon?: IncomingFile;
}

export async function updateService(
	id: string,
	input: UpdateServiceInput,
	files?: ServiceFiles,
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
	const newStorageIds: string[] = [];

	if (files?.cover) {
		const uploaded = await uploadImageSafe({
			buffer: files.cover.buffer,
			originalName: files.cover.originalName,
			mimeType: files.cover.mimeType,
			entityType: SERVICE_ENTITY_TYPE,
			entityId: id,
			field: 'cover',
			uploadedBy,
		});
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			input = { ...input, coverImageUrl: uploaded.url };
			newStorageIds.push(uploaded.storageId);
		}
	}

	if (files?.icon) {
		const uploaded = await uploadImageSafe({
			buffer: files.icon.buffer,
			originalName: files.icon.originalName,
			mimeType: files.icon.mimeType,
			entityType: SERVICE_ENTITY_TYPE,
			entityId: id,
			field: 'icon',
			uploadedBy,
		});
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			input = { ...input, icon: uploaded.url };
			newStorageIds.push(uploaded.storageId);
		}
	}

	Object.assign(service, input);

	try {
		await service.save();
	} catch (error) {
		if (newStorageIds.length > 0) {
			await deleteStorageFilesByIds(newStorageIds).catch(() => {});
		}
		throw error;
	}

	if (newStorageIds.length > 0) {
		await deleteEntityFiles(SERVICE_ENTITY_TYPE, id, {
			exceptStorageIds: newStorageIds,
		}).catch(() => {});
	}

	return {
		data: cleanMongoFields(
			service.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
