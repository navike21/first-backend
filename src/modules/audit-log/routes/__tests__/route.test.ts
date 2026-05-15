import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('@Constants/permissions', () => ({
	PERMISSIONS: {
		AUDIT_LOGS_READ: 'audit-logs:read',
		AUDIT_LOGS_MANAGE: 'audit-logs:manage',
	},
}));

vi.mock('@Modules/auth', () => ({
	authenticate: (_req: unknown, _res: unknown, next: () => void) => next(),
	authorize: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../../controllers/auditLog.list', () => ({
	auditLogListController: (
		_req: unknown,
		res: { json: (v: unknown) => void },
	) => res.json({ ok: true }),
}));

vi.mock('../../controllers/auditLog.getById', () => ({
	auditLogGetByIdController: (
		_req: unknown,
		res: { json: (v: unknown) => void },
	) => res.json({ ok: true }),
}));

import { auditLogApi } from '../route';

describe('auditLogApi route', () => {
	it('registers GET /audit-logs and GET /audit-logs/:id', async () => {
		const app = express();
		const router = express.Router();
		auditLogApi(router);
		app.use(router);

		const list = await request(app).get('/audit-logs');
		expect(list.status).toBe(200);

		const byId = await request(app).get('/audit-logs/some-id');
		expect(byId.status).toBe(200);
	});
});
