import { UpdateMyProfileInput } from '../schemas/user.schema';
import type { IncomingFile } from '@Types/incomingFile';
import { applyUserUpdate } from './applyUserUpdate';

export async function updateMyProfile(
	userId: string,
	input: UpdateMyProfileInput,
	file?: IncomingFile,
	uploadedBy?: string,
) {
	return applyUserUpdate(userId, input, file, uploadedBy);
}
