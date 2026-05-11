import type { Router } from 'express';
import { PERMISSIONS } from '@Constants/permissions';
import { authenticate, authorize } from '@Modules/auth';
import { auditLogListController } from '../controllers/auditLog.list';
import { auditLogGetByIdController } from '../controllers/auditLog.getById';

export function auditLogApi(router: Router) {
	router.get(
		'/audit-logs',
		authenticate,
		authorize(PERMISSIONS.AUDIT_LOGS_READ, PERMISSIONS.AUDIT_LOGS_MANAGE),
		auditLogListController,
	);

	router.get(
		'/audit-logs/:id',
		authenticate,
		authorize(PERMISSIONS.AUDIT_LOGS_READ, PERMISSIONS.AUDIT_LOGS_MANAGE),
		auditLogGetByIdController,
	);
}
