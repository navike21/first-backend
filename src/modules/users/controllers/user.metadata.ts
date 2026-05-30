import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { USER_GENDER_ARRAY } from '@Constants/userGender';
import { PRESENCE_STATUS_ARRAY } from '../infrastructure/UserModel';

export const getUserMetadataController = asyncHandler(async (_req, res) => {
	successResponse(res, {
		statusCode: 200,
		code: 'USER_METADATA',
		message: 'USER_METADATA',
		ns: 'users',
		data: {
			genders: USER_GENDER_ARRAY,
			presenceStatuses: PRESENCE_STATUS_ARRAY,
			// 'deleted' is a system state set only by soft-delete, not user-selectable
			userStatuses: ['active', 'inactive'],
		},
	});
});
