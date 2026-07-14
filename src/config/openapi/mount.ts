import type { Express, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { docsAuthGate } from './docsAuthGate';
import { buildOpenApiDocument } from './document';

// The global helmet CSP (configApp) sends `script-src 'self'` with no
// `unsafe-eval` — Swagger UI's bundled JS relies on `eval`/`new Function`
// internally (Ajv schema compilation, $ref resolution) and silently fails to
// render into #swagger-ui under that policy (blank page, no console-visible
// error to the end user). Relaxed only for this route, which serves no
// user-authored content.
function relaxCspForDocs(
	_req: Request,
	res: Response,
	next: NextFunction,
): void {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;",
	);
	next();
}

/** Mounts interactive API docs at /api/v1/docs (spec JSON at /api/v1/docs.json).
 * Gated by `docsAuthGate` — see that file for how to make this private. */
export function mountApiDocs(app: Express): void {
	const document = buildOpenApiDocument();

	app.get('/api/v1/docs.json', docsAuthGate, (_req, res) => {
		res.json(document);
	});

	app.use(
		'/api/v1/docs',
		relaxCspForDocs,
		docsAuthGate,
		swaggerUi.serve,
		swaggerUi.setup(document, { customSiteTitle: 'First Backend API Docs' }),
	);
}
