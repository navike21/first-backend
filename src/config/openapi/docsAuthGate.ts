import { timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { ENV } from '@Constants/environments';

function timingSafeStringEqual(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) return false;
	return timingSafeEqual(bufA, bufB);
}

/**
 * Gates the API docs route behind HTTP Basic Auth — but only when
 * API_DOCS_USER/API_DOCS_PASSWORD are actually configured. Unset (the
 * default), the docs stay public. Set both in Vercel and redeploy to make
 * the docs private — no code change needed, same URL.
 */
export function docsAuthGate(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const { API_DOCS_USER, API_DOCS_PASSWORD } = ENV;
	if (!API_DOCS_USER || !API_DOCS_PASSWORD) {
		next();
		return;
	}

	const header = req.headers.authorization;
	if (header?.startsWith('Basic ')) {
		const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
		const separatorIndex = decoded.indexOf(':');
		const user =
			separatorIndex === -1 ? decoded : decoded.slice(0, separatorIndex);
		const password =
			separatorIndex === -1 ? '' : decoded.slice(separatorIndex + 1);

		if (
			timingSafeStringEqual(user, API_DOCS_USER) &&
			timingSafeStringEqual(password, API_DOCS_PASSWORD)
		) {
			next();
			return;
		}
	}

	res.set('WWW-Authenticate', 'Basic realm="API Docs"');
	res.status(401).send('Authentication required');
}
