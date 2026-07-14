import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedForms } from '../application/listDeletedForms';

export const formTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedForms({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_TRASH_LIST',
		message: 'SUCCESS_FORM_TRASH_LIST',
		ns: 'forms',
		data,
		meta,
	});
});
