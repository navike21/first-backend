import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { CreateUserGroupSchema } from '../schemas/userGroup.schema';
import { createUserGroup } from '../application/createUserGroup';

export const createUserGroupController = asyncHandler(async (req, res) => {
	const parsed = CreateUserGroupSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const group = await createUserGroup(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'USER_GROUP_CREATED',
		message: 'USER_GROUP_CREATED',
		ns: 'user-groups',
		data: group,
	});
});
