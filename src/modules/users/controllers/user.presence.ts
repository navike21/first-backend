import { z } from 'zod';
import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { updatePresence } from '../application/updatePresence';
import { emitPresenceChange } from '@Shared/infrastructure/SocketServer';
import type { PresenceStatus } from '../infrastructure/UserModel';

const PresenceUpdateSchema = z.object({
	status: z.enum(['available', 'busy', 'away', 'offline']),
});

export const updatePresenceController = asyncHandler(async (req, res) => {
	const parsed = PresenceUpdateSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', parsed.error.issues.map((i) => ({
			path: i.path.join('.'),
			message: i.message,
		})));
	}

	const userId = res.locals.userId as string;
	const data = await updatePresence(
		userId,
		parsed.data.status as PresenceStatus,
	);

	emitPresenceChange(userId, parsed.data.status);

	successResponse(res, {
		statusCode: 200,
		code: 'PRESENCE_UPDATED',
		message: 'PRESENCE_UPDATED',
		ns: 'users',
		data,
	});
});
