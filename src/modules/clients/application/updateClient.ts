import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { ClientNotFoundError } from '../domain/errors/ClientErrors';
import ClientModel from '../infrastructure/ClientModel';
import { CLIENT_ENTITY_TYPE } from '../constants/paths';
import { assertClientUnique } from './assertClientUnique';
import type { UpdateClientInput } from '../schemas/client.schema';

export async function updateClient(
	id: string,
	input: UpdateClientInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const client = await ClientModel.findOne({ id, deletedAt: null });
	if (!client) throw new ClientNotFoundError();

	// De-dup against the effective document values (existing merged with the patch).
	await assertClientUnique(
		{
			documentType: input.documentType ?? client.documentType,
			documentNumber: input.documentNumber ?? client.documentNumber,
			country: input.country ?? client.country,
		},
		id,
	);

	const warnings: ResponseWarning[] = [];
	let uploadedUrl: string | undefined;
	let newStorageId: string | undefined;

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
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			uploadedUrl = uploaded.url;
			newStorageId = uploaded.storageId;
		}
	}

	Object.assign(client, input);
	if (uploadedUrl) client.logoUrl = uploadedUrl;

	try {
		await client.save();
	} catch (error) {
		// Compensation: drop the just-uploaded image, leave the previous one intact.
		if (newStorageId) {
			await deleteStorageFilesByIds([newStorageId]).catch(() => {});
		}
		throw error;
	}

	// On a successful replacement, remove the previous variants (keep the new one).
	if (newStorageId) {
		await deleteEntityFiles(CLIENT_ENTITY_TYPE, id, {
			exceptStorageIds: [newStorageId],
		}).catch(() => {});
	}

	return {
		data: cleanMongoFields(
			client.toObject({ versionKey: false, getters: true }),
		) as Record<string, unknown>,
		warnings,
	};
}
