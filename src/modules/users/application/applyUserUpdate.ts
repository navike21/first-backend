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

/** Uploads the avatar (non-blocking) and returns the new URL/storage id, if any. */
async function uploadAvatarFile(
	file: IncomingFile,
	id: string,
	uploadedBy: string | undefined,
	warnings: ResponseWarning[],
): Promise<{ uploadedUrl?: string; newStorageId?: string }> {
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
		return { uploadedUrl: uploaded.url, newStorageId: uploaded.storageId };
	}
	return {};
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
	// Empty `profilePictureUrl` (and no new file) means: remove the avatar.
	const clearAvatar = !file && input.profilePictureUrl === '';

	const { uploadedUrl, newStorageId } = file
		? await uploadAvatarFile(file, id, uploadedBy, warnings)
		: {};

	const dateOfBirth = input.dateOfBirth
		? new Date(input.dateOfBirth)
		: undefined;
	Object.assign(user, { ...input, ...(dateOfBirth && { dateOfBirth }) });
	if (uploadedUrl) user.profilePictureUrl = uploadedUrl;
	else if (clearAvatar) user.profilePictureUrl = undefined;

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
	} else if (clearAvatar) {
		await deleteEntityFiles(USER_ENTITY_TYPE, id).catch(() => {});
	}

	// eslint-disable-next-line sonarjs/no-unused-vars
	const { password: _pwd, ...safeUser } = user.toObject();
	return { data: safeUser, warnings };
}
