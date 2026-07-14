import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgeCollaboratorsBulk } from '../application/purgeCollaboratorsBulk';

export const purgeCollaboratorsBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await purgeCollaboratorsBulk(validated.ids);

		const code = `COLLABORATORS_BULK_PURGE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'collaborators',
			data,
		});
	},
);
