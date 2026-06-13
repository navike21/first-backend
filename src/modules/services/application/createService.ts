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

export async function createService(
	input: CreateServiceInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const slug = input.slug ?? generateSlug(input.name.en);

	const existing = await ServiceModel.findOne({ slug });
	if (existing) throw new ServiceSlugConflictError();

	const id = generateUUID();
	let coverImageUrl = input.coverImageUrl;
	const warnings: ResponseWarning[] = [];

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
		if (uploaded.url) coverImageUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	try {
		const service = await ServiceModel.create({
			...input,
			id,
			slug,
			coverImageUrl,
		});
		return {
			data: cleanMongoFields(
				service.toObject({ versionKey: false, getters: true }),
			),
			warnings,
		};
	} catch (error) {
		if (file) await deleteEntityFiles(SERVICE_ENTITY_TYPE, id).catch(() => {});
		throw error;
	}
}
