import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { generateSlug } from '@Helpers/generateSlug';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { ServiceSlugConflictError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';
import { SERVICE_ENTITY_TYPE } from '../constants/paths';
import type { CreateServiceInput } from '../schemas/service.schema';

interface ServiceFiles {
	cover?: IncomingFile;
	icon?: IncomingFile;
}

export async function createService(
	input: CreateServiceInput,
	files?: ServiceFiles,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const slug = input.slug ?? generateSlug(input.name.en);

	const existing = await ServiceModel.findOne({ slug });
	if (existing) throw new ServiceSlugConflictError();

	const id = generateUUID();
	let coverImageUrl = input.coverImageUrl;
	let iconUrl = input.icon;
	const warnings: ResponseWarning[] = [];

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
		if (uploaded.url) coverImageUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
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
		if (uploaded.url) iconUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	try {
		const service = await ServiceModel.create({
			...input,
			id,
			slug,
			coverImageUrl,
			icon: iconUrl,
		});
		return {
			data: cleanMongoFields(
				service.toObject({ versionKey: false, getters: true }),
			),
			warnings,
		};
	} catch (error) {
		if (files?.cover || files?.icon) {
			await deleteEntityFiles(SERVICE_ENTITY_TYPE, id).catch(() => {});
		}
		throw error;
	}
}
