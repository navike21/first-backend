import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult } from '@Types/responseStructure';
import SubscriberModel from '../infrastructure/SubscriberModel';
import type { SubscriberSchema } from '../types/subscriber.schema';
import { SUBSCRIBER_ENTITY_TYPE } from '../constants/paths';

export async function registerSubscriber(
	data: SubscriberSchema,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const id = data.id ?? generateUUID();
	let profilePictureUrl = data.personalInformation?.profilePictureUrl;
	const warnings: MutationResult<unknown>['warnings'] = [];

	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: SUBSCRIBER_ENTITY_TYPE,
			entityId: id,
			field: 'photo',
			uploadedBy,
		});
		if (uploaded.url) profilePictureUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	let created;
	try {
		created = await SubscriberModel.create({
			...data,
			id,
			personalInformation: {
				...data.personalInformation,
				profilePictureUrl,
			},
		});
	} catch (error) {
		if (file)
			await deleteEntityFiles(SUBSCRIBER_ENTITY_TYPE, id).catch(() => {});
		throw error;
	}

	return {
		data: cleanMongoFields(
			created.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
