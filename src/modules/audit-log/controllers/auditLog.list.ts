import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listAuditLogs } from '../application/listAuditLogs';
import { AuditLogQuerySchema } from '../schemas/auditLog.schema';

export const auditLogListController = asyncHandler(async (req, res) => {
	const validated = validate(AuditLogQuerySchema, req.query);
	const result = await listAuditLogs(validated);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_AUDIT_LOGS_LIST',
		ns: 'audit-log',
		data: result.data,
		meta: result.meta,
	});
});
