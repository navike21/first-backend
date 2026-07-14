import { z } from 'zod';
import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updatePresence } from '../application/updatePresence';
import { emitPresenceChange } from '@Shared/infrastructure/SocketServer';
import type { PresenceStatus } from '../infrastructure/UserModel';

const PresenceUpdateSchema = z.object({
	status: z.enum(['available', 'busy', 'away', 'offline']),
});

export const updatePresenceController = asyncHandler(async (req, res) => {
	const validated = validate(PresenceUpdateSchema, req.body);

	const userId = res.locals.userId as string;
	const data = await updatePresence(userId, validated.status as PresenceStatus);

	emitPresenceChange(userId, validated.status);

	successResponse(res, {
		statusCode: 200,
		code: 'PRESENCE_UPDATED',
		message: 'PRESENCE_UPDATED',
		ns: 'users',
		data,
	});
});
