import type { Request, Response, NextFunction } from 'express';
import { logError } from '@Helpers/log';
import { createAuditEntry } from '../application/createAuditEntry';

export interface CaptureAuditOptions {
	action: string;
	resource: string;
	getResourceId?: (req: Request) => string | undefined;
	getMetadata?: (req: Request) => Record<string, unknown> | undefined;
	/**
	 * When true, non-2xx responses are also recorded (with `success: false` and
	 * the status code in metadata). Used for security-relevant endpoints such as
	 * login, so failed/denied attempts are not silently dropped.
	 */
	captureFailures?: boolean;
}

function sanitizeObject(obj: unknown): unknown {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return (obj as unknown[]).map(sanitizeObject);
	}

	const sanitized: Record<string, unknown> = {};
	const sensitiveKeys = new Set([
		'password',
		'confirmpassword',
		'newpassword',
		'currentpassword',
		'passwordconfirmation',
		'token',
		'secret',
		'accesstoken',
		'refreshtoken',
		'apikey',
		'authorization',
		'pin',
		'card',
		'cvv',
	]);

	for (const key of Object.keys(obj as Record<string, unknown>)) {
		const lowerKey = key.toLowerCase();
		if (sensitiveKeys.has(lowerKey)) {
			sanitized[key] = '[REDACTED]';
		} else {
			sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
		}
	}

	return sanitized;
}

export function captureAudit(options: CaptureAuditOptions) {
	return (req: Request, res: Response, next: NextFunction): void => {
		res.on('finish', () => {
			const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
			if (!isSuccess && !options.captureFailures) return;

			const userId = res.locals.userId as string | undefined;
			const user = res.locals.user as { firstName: string; lastName: string; email: string } | undefined;
			const ipAddress =
				(req.headers['x-forwarded-for'] as string | undefined) ??
				req.socket?.remoteAddress;
			const userAgent = req.headers['user-agent'];
			const resourceId = options.getResourceId?.(req) ?? (typeof req.params?.id === 'string' ? req.params.id : undefined);
			
			const baseMetadata = options.getMetadata?.(req) ?? {};
			const executionDetails: Record<string, unknown> = {};

			if (req.body && Object.keys(req.body).length > 0) {
				executionDetails.payload = sanitizeObject(req.body);
			}

			if (req.params && Object.keys(req.params).length > 0) {
				executionDetails.params = { ...req.params };
			}

			if (req.query && Object.keys(req.query).length > 0) {
				executionDetails.query = { ...req.query };
			}

			const metadata = {
				...baseMetadata,
				...executionDetails,
				...(isSuccess ? {} : { success: false, statusCode: res.statusCode }),
			};

			// Only write user details if they exist in locals (which comes from JWT)
			const populatedUser = user?.firstName && user?.lastName && user?.email ? user : undefined;

			createAuditEntry({
				userId,
				action: options.action,
				resource: options.resource,
				resourceId,
				metadata,
				ipAddress,
				userAgent,
				user: populatedUser,
			}).catch((err) => {
				logError(`[Audit Capture Error]: Failed to create audit log entry: ${String(err)}`);
			});
		});
		next();
	};
}

