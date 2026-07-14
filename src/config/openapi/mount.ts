import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { docsAuthGate } from './docsAuthGate';
import { buildOpenApiDocument } from './document';

/** Mounts interactive API docs at /api/v1/docs (spec JSON at /api/v1/docs.json).
 * Gated by `docsAuthGate` — see that file for how to make this private. */
export function mountApiDocs(app: Express): void {
	const document = buildOpenApiDocument();

	app.get('/api/v1/docs.json', docsAuthGate, (_req, res) => {
		res.json(document);
	});

	app.use(
		'/api/v1/docs',
		docsAuthGate,
		swaggerUi.serve,
		swaggerUi.setup(document, { customSiteTitle: 'First Backend API Docs' }),
	);
}
