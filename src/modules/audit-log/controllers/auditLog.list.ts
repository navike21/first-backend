import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { listAuditLogs } from '../application/listAuditLogs';
import { AuditLogQuerySchema } from '../schemas/auditLog.schema';

export const auditLogListController = asyncHandler(async (req, res) => {
	const parsed = AuditLogQuerySchema.safeParse(req.query);
	if (!parsed.success) {
		setThrowError({
			statusCode: 400,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed for the provided data',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}
	const result = await listAuditLogs(parsed.data!);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_AUDIT_LOGS_LIST',
		ns: 'audit-log',
		data: result.data,
		meta: result.meta,
	});
});
