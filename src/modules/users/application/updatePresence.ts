import type { PresenceStatus } from '../infrastructure/UserModel';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';
import { getOnlineUsers } from '@Shared/infrastructure/SocketServer';

export async function updatePresence(userId: string, status: PresenceStatus) {
	const update: Record<string, unknown> = { presenceStatus: status };
	if (status === 'offline') update.lastSeenAt = new Date();

	const user = await UserModel.findOneAndUpdate(
		{ id: userId },
		{ $set: update },
		{ new: true, projection: { password: 0 } },
	).lean();

	if (!user) throw new UserNotFoundError();

	return { userId, status, onlineUsers: getOnlineUsers() };
}
