import type { Express } from 'express';
import { configApp } from './app';

// Must be imported before `mainRouter` below: `extendZodWithOpenApi` patches
// Zod's schema factories, and only schemas constructed *after* the patch gain
// `.openapi()`. `mainRouter` transitively constructs every module's Zod
// schemas at import time, so this import order is load-bearing — reordering
// it silently breaks `.openapi()` on every schema reused from a business
// module (they still typecheck; it only fails at runtime, inside
// buildOpenApiDocument()).
import { mountApiDocs } from './openapi/mount';

import { initI18n } from './i18n';
import mainRouter from '@Routes/routes';
import { errorMiddleware } from '@Middlewares/errorMiddleware';
import { registerEmailSubscribers } from '@Modules/notifications-email';

// Sets up i18n, middleware and routes — no DB needed, safe to call at module load.
export async function initApp(app: Express): Promise<void> {
	await initI18n();
	registerEmailSubscribers();
	configApp(app);
	mountApiDocs(app);
	app.use(mainRouter());
	app.use(errorMiddleware);
}

export { connectToDatabase } from '@Connection/connectionDB';
