import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { UpdateUserGroupSchema } from '../schemas/userGroup.schema';
import { updateUserGroup } from '../application/updateUserGroup';

export const updateUserGroupController = asyncHandler(async (req, res) => {
	const parsed = UpdateUserGroupSchema.safeParse(req.body);
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

	const group = await updateUserGroup(String(req.params.id), parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_UPDATED',
		message: 'USER_GROUP_UPDATED',
		ns: 'user-groups',
		data: group,
	});
});
