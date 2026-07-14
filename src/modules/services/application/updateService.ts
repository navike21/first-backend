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

interface AppliedUploads {
	input: UpdateServiceInput;
	warnings: ResponseWarning[];
	storageIds: string[];
}

async function checkSlugConflict(
	id: string,
	slug?: UpdateServiceInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await ServiceModel.findOne({
		$or: orQuery,
		id: { $ne: id },
	});
	if (conflict) throw new ServiceSlugConflictError();
}

async function applyFileUploads(
	id: string,
	files: ServiceFiles | undefined,
	input: UpdateServiceInput,
	uploadedBy?: string,
): Promise<AppliedUploads> {
	const warnings: ResponseWarning[] = [];
	const storageIds: string[] = [];
	let updatedInput = input;

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
			updatedInput = { ...updatedInput, coverImageUrl: uploaded.url };
			storageIds.push(uploaded.storageId);
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
			updatedInput = { ...updatedInput, icon: uploaded.url };
			storageIds.push(uploaded.storageId);
		}
	}

	return { input: updatedInput, warnings, storageIds };
}

export async function updateService(
	id: string,
	input: UpdateServiceInput,
	files?: ServiceFiles,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const service = await ServiceModel.findOne({ id, status: 'active' });
	if (!service) throw new ServiceNotFoundError();

	await checkSlugConflict(id, input.slug);

	const {
		input: updatedInput,
		warnings,
		storageIds,
	} = await applyFileUploads(id, files, input, uploadedBy);

	Object.assign(service, updatedInput);

	try {
		await service.save();
	} catch (error) {
		if (storageIds.length > 0) {
			await deleteStorageFilesByIds(storageIds).catch(() => {});
		}
		throw error;
	}

	if (storageIds.length > 0) {
		await deleteEntityFiles(SERVICE_ENTITY_TYPE, id, {
			exceptStorageIds: storageIds,
		}).catch(() => {});
	}

	return {
		data: cleanMongoFields(
			service.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
