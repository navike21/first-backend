import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { UpdateUserGroupSchema } from '../schemas/userGroup.schema';
import { updateUserGroup } from '../application/updateUserGroup';

export const updateUserGroupController = asyncHandler(async (req, res) => {
	const parsed = UpdateUserGroupSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const group = await updateUserGroup(String(req.params.id), parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_UPDATED',
		message: 'USER_GROUP_UPDATED',
		ns: 'user-groups',
		data: group,
	});
});
