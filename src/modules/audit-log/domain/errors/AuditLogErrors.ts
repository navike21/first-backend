export const AUDIT_LOG_ERRORS = {
	NOT_FOUND: 'AUDIT_LOG_NOT_FOUND',
} as const;

export type AuditLogErrorCode =
	(typeof AUDIT_LOG_ERRORS)[keyof typeof AUDIT_LOG_ERRORS];
