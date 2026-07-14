import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult } from '@Types/responseStructure';
import SubscriberModel from '../infrastructure/SubscriberModel';
import type { UpdateSubscriberInput } from '../schemas/subscriber.updateSchema';
import { SUBSCRIBER_ENTITY_TYPE } from '../constants/paths';

export async function updateSubscriber(
	id: string,
	data: UpdateSubscriberInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const subscriber = await SubscriberModel.findOne({ id });
	if (!subscriber)
		AppError.notFound('SUBSCRIBER_NOT_FOUND', 'Subscriber not found');

	const clearPhoto =
		!file && data.personalInformation?.profilePictureUrl === '';
	const warnings: MutationResult<unknown>['warnings'] = [];
	const storageIds: string[] = [];
	let updatedData = data;

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
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			storageIds.push(uploaded.storageId);
			updatedData = {
				...data,
				personalInformation: {
					...data.personalInformation,
					profilePictureUrl: uploaded.url,
				},
			};
		}
	} else if (clearPhoto) {
		updatedData = {
			...data,
			personalInformation: {
				...data.personalInformation,
				profilePictureUrl: undefined,
			},
		};
	}

	Object.assign(subscriber, updatedData);

	try {
		await subscriber.save();
	} catch (error) {
		if (storageIds.length > 0) {
			await deleteStorageFilesByIds(storageIds).catch(() => {});
		}
		throw error;
	}

	if (storageIds.length > 0) {
		await deleteEntityFiles(SUBSCRIBER_ENTITY_TYPE, id, {
			exceptStorageIds: storageIds,
		}).catch(() => {});
	} else if (clearPhoto) {
		await deleteEntityFiles(SUBSCRIBER_ENTITY_TYPE, id).catch(() => {});
	}

	return {
		data: cleanMongoFields(
			subscriber.toObject({ versionKey: false, getters: true }),
		),
		warnings,
	};
}
