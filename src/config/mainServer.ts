import type { Express } from 'express';
import { configApp } from './app';

import { initI18n } from './i18n';
import mainRouter from '@Routes/routes';
import { errorMiddleware } from '@Middlewares/errorMiddleware';
import { registerEmailSubscribers } from '@Modules/notifications-email';

// Sets up i18n, middleware and routes — no DB needed, safe to call at module load.
export async function initApp(app: Express): Promise<void> {
	await initI18n();
	registerEmailSubscribers();
	configApp(app);
	app.use(mainRouter());
	app.use(errorMiddleware);
}

export { connectToDatabase } from '@Connection/connectionDB';
