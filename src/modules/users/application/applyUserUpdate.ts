import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { USER_ENTITY_TYPE } from '../constants/entity';

interface UpdateInput {
	dateOfBirth?: string;
	[key: string]: unknown;
}

export async function applyUserUpdate(
	id: string,
	input: UpdateInput,
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const user = await UserModel.findOne({ id });
	if (!user) throw new UserNotFoundError();

	const warnings: ResponseWarning[] = [];
	let uploadedUrl: string | undefined;
	let newStorageId: string | undefined;

	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: USER_ENTITY_TYPE,
			entityId: id,
			field: 'avatar',
			uploadedBy,
		});
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			uploadedUrl = uploaded.url;
			newStorageId = uploaded.storageId;
		}
	}

	const dateOfBirth = input.dateOfBirth
		? new Date(input.dateOfBirth)
		: undefined;
	Object.assign(user, { ...input, ...(dateOfBirth && { dateOfBirth }) });
	if (uploadedUrl) user.profilePictureUrl = uploadedUrl;

	try {
		await user.save();
	} catch (error) {
		if (newStorageId) {
			await deleteStorageFilesByIds([newStorageId]).catch(() => {});
		}
		throw error;
	}

	if (newStorageId) {
		await deleteEntityFiles(USER_ENTITY_TYPE, id, {
			exceptStorageIds: [newStorageId],
		}).catch(() => {});
	}

	// eslint-disable-next-line sonarjs/no-unused-vars
	const { password: _pwd, ...safeUser } = user.toObject();
	return { data: safeUser, warnings };
}
