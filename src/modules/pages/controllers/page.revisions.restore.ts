import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restorePageRevision } from '../application/pageRevisions';

export const pageRevisionsRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const revisionId = String(req.params.revisionId);
	const data = await restorePageRevision(id, revisionId, res.locals.userId as string | undefined);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_REVISION_RESTORED',
		message: 'SUCCESS_PAGE_REVISION_RESTORED',
		ns: 'pages',
		data,
	});
});
