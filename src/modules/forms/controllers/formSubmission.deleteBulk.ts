import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { deleteFormSubmissionsBulk } from '../application/deleteFormSubmissionsBulk';

export const deleteFormSubmissionsBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await deleteFormSubmissionsBulk(
			String(req.params.id),
			validated.ids,
		);

		const code = `FORM_SUBMISSIONS_BULK_SOFT_DELETE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'forms',
			data,
		});
	},
);
