import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { CreateUserGroupSchema } from '../schemas/userGroup.schema';
import { createUserGroup } from '../application/createUserGroup';

export const createUserGroupController = asyncHandler(async (req, res) => {
	const parsed = CreateUserGroupSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
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
