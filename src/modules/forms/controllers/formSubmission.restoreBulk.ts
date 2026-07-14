import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restoreFormSubmissionsBulk } from '../application/restoreFormSubmissionsBulk';

export const restoreFormSubmissionsBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await restoreFormSubmissionsBulk(
			String(req.params.id),
			validated.ids,
		);

		const code = `FORM_SUBMISSIONS_BULK_RESTORE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'forms',
			data,
		});
	},
);
