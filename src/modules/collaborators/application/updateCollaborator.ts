import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { CollaboratorNotFoundError } from '../domain/errors/CollaboratorErrors';
import { COLLABORATOR_ENTITY_TYPE } from '../constants/paths';
import { updateCollaboratorInput } from '../schemas/collaborator.schema';

export async function updateCollaborator(
	id: string,
	input: updateCollaboratorInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const doc = await CollaboratorModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CollaboratorNotFoundError();

	const warnings: ResponseWarning[] = [];
	let uploadedUrl: string | undefined;
	let newStorageId: string | undefined;

	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: COLLABORATOR_ENTITY_TYPE,
			entityId: id,
			field: 'photo',
			uploadedBy,
		});
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			uploadedUrl = uploaded.url;
			newStorageId = uploaded.storageId;
		}
	}

	Object.assign(doc, input, uploadedUrl ? { photoUrl: uploadedUrl } : {});

	try {
		await doc.save();
	} catch (error) {
		if (newStorageId) {
			await deleteStorageFilesByIds([newStorageId]).catch(() => {});
		}
		throw error;
	}

	if (newStorageId) {
		await deleteEntityFiles(COLLABORATOR_ENTITY_TYPE, id, {
			exceptStorageIds: [newStorageId],
		}).catch(() => {});
	}

	return { data: cleanMongoFields(doc.toObject()), warnings };
}
