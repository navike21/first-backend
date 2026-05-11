import type { Request, Response, NextFunction } from 'express';
import { createAuditEntry } from '../application/createAuditEntry';

export interface CaptureAuditOptions {
	action: string;
	resource: string;
	getResourceId?: (req: Request) => string | undefined;
	getMetadata?: (req: Request) => Record<string, unknown> | undefined;
}

export function captureAudit(options: CaptureAuditOptions) {
	return (req: Request, res: Response, next: NextFunction): void => {
		res.on('finish', () => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				const userId = res.locals.userId as string | undefined;
				const ipAddress =
					(req.headers['x-forwarded-for'] as string | undefined) ??
					req.socket?.remoteAddress;
				const userAgent = req.headers['user-agent'];
				const resourceId = options.getResourceId?.(req);
				const metadata = options.getMetadata?.(req);

				createAuditEntry({
					userId,
					action: options.action,
					resource: options.resource,
					resourceId,
					metadata,
					ipAddress,
					userAgent,
				}).catch(() => {});
			}
		});
		next();
	};
}
