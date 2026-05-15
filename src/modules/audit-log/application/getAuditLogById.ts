import AuditLogModel from '../infrastructure/AuditLogModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { AUDIT_LOG_ERRORS } from '../domain/errors/AuditLogErrors';

export async function getAuditLogById(id: string) {
	const log = await AuditLogModel.findOne({ id }).lean();
	if (!log) {
		AppError.notFound(AUDIT_LOG_ERRORS.NOT_FOUND, 'Audit log entry not found');
	}
	return cleanMongoFields(log!);
}
