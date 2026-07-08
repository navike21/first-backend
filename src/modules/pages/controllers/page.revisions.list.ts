import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listPageRevisions } from '../application/pageRevisions';

export const pageRevisionsListController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await listPageRevisions(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_REVISIONS_LIST',
		message: 'SUCCESS_PAGE_REVISIONS_LIST',
		ns: 'pages',
		data,
	});
});
