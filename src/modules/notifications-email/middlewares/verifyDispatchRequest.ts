import type { Request, Response, NextFunction } from 'express';
import { ENV } from '@Constants/environments';
import { errorResponse } from '@Helpers/responseStructure';

/**
 * Protege `POST /emails/dispatch` — solo el disparador del worker debe drenarlo.
 * El trigger (schedule de QStash) reenvía `Authorization: Bearer
 * <EMAIL_DISPATCH_SECRET>`; acá se compara.
 *
 * Fail-closed: en producción sin secret configurado, se rechaza cualquier
 * petición (no dejar el endpoint abierto por un env faltante). En dev/test sin
 * secret, se permite para poder drenar localmente sin montar el trigger.
 */
export function verifyDispatchRequest(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const secret = ENV.EMAIL_DISPATCH_SECRET;

	if (!secret) {
		if (ENV.NODE_ENV === 'production') {
			errorResponse(res, {
				statusCode: 503,
				code: 'EMAIL_DISPATCH_NOT_CONFIGURED',
				message: 'Email dispatch endpoint is not configured',
			});
			return;
		}
		next();
		return;
	}

	const header = req.header('authorization') ?? '';
	const expected = `Bearer ${secret}`;
	if (header !== expected) {
		errorResponse(res, {
			statusCode: 401,
			code: 'UNAUTHORIZED',
			message: 'Unauthorized',
		});
		return;
	}

	next();
}
