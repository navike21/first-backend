import { UpdateUserInput } from '../schemas/user.schema';
import { applyUserUpdate } from './applyUserUpdate';

export async function updateUser(id: string, input: UpdateUserInput) {
	return applyUserUpdate(id, input);
}
