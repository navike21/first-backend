import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getAuditLogById } from '../application/getAuditLogById';

export const auditLogGetByIdController = asyncHandler(async (req, res) => {
	const id = req.params.id as string;
	const log = await getAuditLogById(id);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_AUDIT_LOG_FOUND',
		ns: 'audit-log',
		data: log,
	});
});
