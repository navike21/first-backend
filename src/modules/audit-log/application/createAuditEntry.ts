import AuditLogModel from '../infrastructure/AuditLogModel';

export interface AuditEntryPayload {
	userId?: string;
	action: string;
	resource: string;
	resourceId?: string;
	metadata?: Record<string, unknown>;
	ipAddress?: string;
	userAgent?: string;
}

export async function createAuditEntry(
	payload: AuditEntryPayload,
): Promise<void> {
	await AuditLogModel.create(payload);
}
