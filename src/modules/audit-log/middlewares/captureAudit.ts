import type { Request, Response, NextFunction } from 'express';
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

export function captureAudit(options: CaptureAuditOptions) {
	return (req: Request, res: Response, next: NextFunction): void => {
		res.on('finish', () => {
			const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
			if (!isSuccess && !options.captureFailures) return;

			const userId = res.locals.userId as string | undefined;
			const ipAddress =
				(req.headers['x-forwarded-for'] as string | undefined) ??
				req.socket?.remoteAddress;
			const userAgent = req.headers['user-agent'];
			const resourceId = options.getResourceId?.(req);
			const baseMetadata = options.getMetadata?.(req);
			const metadata = isSuccess
				? baseMetadata
				: { ...baseMetadata, success: false, statusCode: res.statusCode };

			createAuditEntry({
				userId,
				action: options.action,
				resource: options.resource,
				resourceId,
				metadata,
				ipAddress,
				userAgent,
			}).catch((err) => {
				console.error('[Audit Capture Error]: Failed to create audit log entry:', err);
			});
		});
		next();
	};
}
