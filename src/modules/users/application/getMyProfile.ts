import { getUserById } from './getUserById';

export async function getMyProfile(userId: string) {
	return getUserById(userId);
}
