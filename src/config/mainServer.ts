import type { Express } from 'express';
import { configApp } from './app';
import { connectToDatabase } from '@Connection/connectionDB';
import { initI18n } from './i18n';
import mainRouter from '@Routes/routes';
import { errorMiddleware } from '@Middlewares/errorMiddleware';

export async function initializeApp(app: Express): Promise<void> {
	await initI18n();
	await connectToDatabase();

	configApp(app);
	app.use(mainRouter());
	app.use(errorMiddleware);
}
