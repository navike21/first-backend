import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('@Constants/permissions', () => ({
	PERMISSIONS: {
		APP_SETTINGS_UPDATE: 'app-settings:update',
		APP_SETTINGS_MANAGE: 'app-settings:manage',
	},
}));

vi.mock('@Modules/auth', () => ({
	authenticate: (_req: unknown, _res: unknown, next: () => void) => next(),
	authorize: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../../controllers/appSettings.get', () => ({
	appSettingsGetController: (
		_req: unknown,
		res: { json: (v: unknown) => void },
	) => res.json({ ok: true }),
}));

vi.mock('../../controllers/appSettings.update', () => ({
	appSettingsUpdateController: (
		_req: unknown,
		res: { json: (v: unknown) => void },
	) => res.json({ ok: true }),
}));

import { appSettingsApi } from '../route';

describe('appSettingsApi route', () => {
	it('registers GET /app-settings and PATCH /app-settings', async () => {
		const app = express();
		app.use(express.json());
		const router = express.Router();
		appSettingsApi(router);
		app.use(router);

		const get = await request(app).get('/app-settings');
		expect(get.status).toBe(200);

		const patch = await request(app).patch('/app-settings').send({});
		expect(patch.status).toBe(200);
	});
});
