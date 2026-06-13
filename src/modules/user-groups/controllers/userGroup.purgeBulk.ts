import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgeUserGroupsBulk } from '../application/purgeUserGroupsBulk';

export const purgeUserGroupsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await purgeUserGroupsBulk(validated.ids);

	const code = `USER_GROUPS_BULK_PURGE_${bulkOutcome(data)}`;

	successResponse(res, { statusCode: 200, code, message: code, ns: 'user-groups', data });
});
