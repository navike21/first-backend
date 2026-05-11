import AuditLogModel from '../infrastructure/AuditLogModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
import { AUDIT_LOG_ERRORS } from '../domain/errors/AuditLogErrors';

export async function getAuditLogById(id: string) {
	const log = await AuditLogModel.findOne({ id }).lean();
	if (!log) {
		setThrowError({
			statusCode: 404,
			code: AUDIT_LOG_ERRORS.NOT_FOUND,
			message: 'Audit log entry not found',
		});
	}
	return cleanMongoFields(log!);
}
