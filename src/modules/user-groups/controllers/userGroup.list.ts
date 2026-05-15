import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { ListUserGroupsQuerySchema } from '../schemas/userGroup.schema';
import { listUserGroups } from '../application/listUserGroups';

export const listUserGroupsController = asyncHandler(async (req, res) => {
	const parsed = ListUserGroupsQuerySchema.safeParse(req.query);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const result = await listUserGroups(parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUPS_LISTED',
		message: 'USER_GROUPS_LISTED',
		ns: 'user-groups',
		data: result,
	});
});
