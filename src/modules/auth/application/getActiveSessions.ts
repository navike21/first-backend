import SessionModel from '../infrastructure/SessionModel';

export async function getActiveSessions(userId: string) {
	const sessions = await SessionModel.find({ userId })
		.select({ userId: 0, __v: 0, _id: 0 })
		.lean();

	return sessions;
}
