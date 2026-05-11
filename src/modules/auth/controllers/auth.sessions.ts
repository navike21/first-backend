import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getActiveSessions } from '../application/getActiveSessions';

export const authGetSessions = asyncHandler(async (_req, res) => {
	const sessions = await getActiveSessions(res.locals.userId as string);
	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_SESSIONS_LIST',
		message: 'AUTH_SESSIONS_LIST',
		ns: 'auth',
		data: sessions,
	});
});
