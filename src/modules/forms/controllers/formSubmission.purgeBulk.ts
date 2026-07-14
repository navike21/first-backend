import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgeFormSubmissionsBulk } from '../application/purgeFormSubmissionsBulk';

export const purgeFormSubmissionsBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await purgeFormSubmissionsBulk(
			String(req.params.id),
			validated.ids,
		);

		const code = `FORM_SUBMISSIONS_BULK_PERMANENTLY_DELETE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'forms',
			data,
		});
	},
);
