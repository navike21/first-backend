import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { deleteUsersBulk } from '../application/deleteUsersBulk';

export const deleteUsersBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await deleteUsersBulk(
		validated.ids,
		res.locals.userId as string | undefined,
	);

	const code = `USERS_BULK_SOFT_DELETE_${bulkOutcome(data)}`;

	successResponse(res, { statusCode: 200, code, message: code, ns: 'users', data });
});
