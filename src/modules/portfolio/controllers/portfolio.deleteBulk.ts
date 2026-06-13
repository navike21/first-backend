import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { deletePortfolioBulk } from '../application/deletePortfolioBulk';

export const deletePortfolioBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await deletePortfolioBulk(validated.ids);

	const code = `PORTFOLIO_BULK_SOFT_DELETE_${bulkOutcome(data)}`;

	successResponse(res, { statusCode: 200, code, message: code, ns: 'portfolio', data });
});
