import { AppError } from '@Shared/domain/AppError';
import { logError } from '@Helpers/log';
import { errorResponse } from '@Helpers/responseStructure';
import type { NextFunction, Request, Response } from 'express';
import i18next from '@Config/i18n';
import { createAuditEntry } from '@Modules/audit-log/application/createAuditEntry';

interface DuplicateKeyError {
	code: number;
	keyValue?: Record<string, unknown>;
}

function isDuplicateKeyError(error: unknown): error is DuplicateKeyError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: unknown }).code === 11000
	);
}

/**
 * Records every denied access (403) in the audit log — best-effort and
 * centralized, so any `authorize` rejection across the app is captured, not just
 * login. Failed logins are audited separately via captureAudit(captureFailures).
 */
function auditAccessDenied(req: Request, res: Response, error: AppError): void {
	createAuditEntry({
		userId: res.locals.userId as string | undefined,
		action: 'access:denied',
		resource: 'auth',
		metadata: {
			code: error.code,
			method: req.method,
			path: req.originalUrl,
		},
		ipAddress:
			(req.headers?.['x-forwarded-for'] as string | undefined) ??
			req.socket?.remoteAddress,
		userAgent: req.headers?.['user-agent'],
	}).catch(() => {});
}

export const errorMiddleware = (
	error: unknown,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const lang = typeof res.locals.lang === 'string' ? res.locals.lang : 'en';
	if (error instanceof AppError) {
		if (error.statusCode === 403) auditAccessDenied(req, res, error);
		const message = i18next.t(error.code, {
			lng: lang,
			defaultValue: error.message,
		});
		return errorResponse(res, {
			statusCode: error.statusCode,
			code: error.code,
			message,
			details: error.details,
		});
	}

	// MongoDB duplicate-key (E11000) → 409. The unique index is the source of truth
	// for de-duplication; this maps the raw driver error to a clean API response.
	if (isDuplicateKeyError(error)) {
		const message = i18next.t('RESOURCE_DUPLICATE', {
			lng: lang,
			defaultValue: 'A record with these unique values already exists',
		});
		return errorResponse(res, {
			statusCode: 409,
			code: 'RESOURCE_DUPLICATE',
			message,
			details: error.keyValue
				? { keys: Object.keys(error.keyValue) }
				: undefined,
		});
	}

	const errorMessage =
		error instanceof Error ? `${error.message}\n${error.stack}` : String(error);

	logError(`Unhandled error: ${errorMessage}`);

	const message = i18next.t('INTERNAL_SERVER_ERROR', {
		lng: lang,
		defaultValue: 'An unexpected error occurred',
	});
	return errorResponse(res, {
		statusCode: 500,
		code: 'INTERNAL_SERVER_ERROR',
		message,
	});
};
