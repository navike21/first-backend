import { UpdateMyProfileInput } from '../schemas/user.schema';
import { applyUserUpdate } from './applyUserUpdate';

export async function updateMyProfile(userId: string, input: UpdateMyProfileInput) {
	return applyUserUpdate(userId, input);
}
