import { UpdateUserInput } from '../schemas/user.schema';
import type { IncomingFile } from '@Types/incomingFile';
import { applyUserUpdate } from './applyUserUpdate';

export async function updateUser(
	id: string,
	input: UpdateUserInput,
	file?: IncomingFile,
	uploadedBy?: string,
) {
	return applyUserUpdate(id, input, file, uploadedBy);
}
