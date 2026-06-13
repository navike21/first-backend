import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { deleteUserGroupsBulk } from '../application/deleteUserGroupsBulk';

export const deleteUserGroupsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await deleteUserGroupsBulk(validated.ids);

	const code = `USER_GROUPS_BULK_SOFT_DELETE_${bulkOutcome(data)}`;

	successResponse(res, { statusCode: 200, code, message: code, ns: 'user-groups', data });
});
