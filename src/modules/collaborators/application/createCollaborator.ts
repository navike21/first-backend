import generateUUID from '@Helpers/uuid';
import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { COLLABORATOR_ENTITY_TYPE } from '../constants/paths';
import { createCollaboratorInput } from '../schemas/collaborator.schema';

export async function createCollaborator(
	input: createCollaboratorInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const id = generateUUID();
	let photoUrl = input.photoUrl;
	const warnings: ResponseWarning[] = [];

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
		if (uploaded.url) photoUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	try {
		const doc = await CollaboratorModel.create({ ...input, id, photoUrl });
		return { data: cleanMongoFields(doc.toObject()), warnings };
	} catch (error) {
		if (file) {
			await deleteEntityFiles(COLLABORATOR_ENTITY_TYPE, id).catch(() => {});
		}
		throw error;
	}
}
