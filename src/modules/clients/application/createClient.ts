import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import ClientModel from '../infrastructure/ClientModel';
import { CLIENT_ENTITY_TYPE } from '../constants/paths';
import { assertClientUnique } from './assertClientUnique';
import type { CreateClientInput } from '../schemas/client.schema';

export async function createClient(
	input: CreateClientInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	// 1. De-dup pre-check (cheap) before paying for the upload.
	await assertClientUnique(input);

	// 2. Pre-generate the id so the blob path is known before the insert.
	const id = generateUUID();
	let logoUrl = input.logoUrl;
	const warnings: ResponseWarning[] = [];

	// 3. Upload the image (non-blocking: a failure becomes a warning).
	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: CLIENT_ENTITY_TYPE,
			entityId: id,
			field: 'logo',
			uploadedBy,
		});
		if (uploaded.url) logoUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	// 4. Insert. The unique index is the source of truth; a race that violates it
	//    throws E11000 (mapped to 409 by errorMiddleware) and we compensate the blob.
	try {
		const client = await ClientModel.create({ ...input, id, logoUrl });
		return {
			data: cleanMongoFields(
				client.toObject({ versionKey: false, getters: true }),
			) as Record<string, unknown>,
			warnings,
		};
	} catch (error) {
		if (file) await deleteEntityFiles(CLIENT_ENTITY_TYPE, id).catch(() => {});
		throw error;
	}
}
