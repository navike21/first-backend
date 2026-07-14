import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('@Constants/permissions', () => ({
	PERMISSIONS: {
		FORMS_READ: 'forms:read',
		FORMS_CREATE: 'forms:create',
		FORMS_UPDATE: 'forms:update',
		FORMS_DELETE: 'forms:delete',
		FORMS_PURGE: 'forms:purge',
		FORMS_MANAGE: 'forms:manage',
		FORMS_SUBMISSIONS_READ: 'forms-submissions:read',
		FORMS_SUBMISSIONS_DELETE: 'forms-submissions:delete',
		FORMS_SUBMISSIONS_PURGE: 'forms-submissions:purge',
		FORMS_SUBMISSIONS_MANAGE: 'forms-submissions:manage',
	},
}));

vi.mock('@Modules/auth/middlewares/authenticate', () => ({
	authenticate: (_req: unknown, _res: unknown, next: () => void) => next(),
}));
vi.mock('@Modules/auth/middlewares/authorize', () => ({
	authorize: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));
vi.mock('@Modules/audit-log/middlewares/captureAudit', () => ({
	captureAudit: () => (_req: unknown, _res: unknown, next: () => void) =>
		next(),
}));
vi.mock('@Config/limiter', () => ({
	formSubmissionLimiter: (_req: unknown, _res: unknown, next: () => void) =>
		next(),
}));

function mockController(name: string) {
	return (_req: unknown, res: { json: (v: unknown) => void }) =>
		res.json({ controller: name });
}

vi.mock('../../controllers/form.getByIdPublic', () => ({
	formGetByIdPublicController: mockController('form.getByIdPublic'),
}));
vi.mock('../../controllers/formSubmission.submit', () => ({
	formSubmissionSubmitController: mockController('formSubmission.submit'),
}));
vi.mock('../../controllers/form.trash', () => ({
	formTrashController: mockController('form.trash'),
}));
vi.mock('../../controllers/form.list', () => ({
	formListController: mockController('form.list'),
}));
vi.mock('../../controllers/form.getById', () => ({
	formGetByIdController: mockController('form.getById'),
}));
vi.mock('../../controllers/form.create', () => ({
	formCreateController: mockController('form.create'),
}));
vi.mock('../../controllers/form.update', () => ({
	formUpdateController: mockController('form.update'),
}));
vi.mock('../../controllers/form.delete', () => ({
	formDeleteController: mockController('form.delete'),
}));
vi.mock('../../controllers/form.restore', () => ({
	formRestoreController: mockController('form.restore'),
}));
vi.mock('../../controllers/form.purge', () => ({
	formPurgeController: mockController('form.purge'),
}));
vi.mock('../../controllers/form.deleteBulk', () => ({
	deleteFormsBulkController: mockController('form.deleteBulk'),
}));
vi.mock('../../controllers/form.restoreBulk', () => ({
	restoreFormsBulkController: mockController('form.restoreBulk'),
}));
vi.mock('../../controllers/form.purgeBulk', () => ({
	purgeFormsBulkController: mockController('form.purgeBulk'),
}));
vi.mock('../../controllers/formSubmission.trash', () => ({
	formSubmissionTrashController: mockController('formSubmission.trash'),
}));
vi.mock('../../controllers/formSubmission.list', () => ({
	formSubmissionListController: mockController('formSubmission.list'),
}));
vi.mock('../../controllers/formSubmission.getById', () => ({
	formSubmissionGetByIdController: mockController('formSubmission.getById'),
}));
vi.mock('../../controllers/formSubmission.markRead', () => ({
	formSubmissionMarkReadController: mockController('formSubmission.markRead'),
}));
vi.mock('../../controllers/formSubmission.delete', () => ({
	formSubmissionDeleteController: mockController('formSubmission.delete'),
}));
vi.mock('../../controllers/formSubmission.restore', () => ({
	formSubmissionRestoreController: mockController('formSubmission.restore'),
}));
vi.mock('../../controllers/formSubmission.purge', () => ({
	formSubmissionPurgeController: mockController('formSubmission.purge'),
}));
vi.mock('../../controllers/formSubmission.deleteBulk', () => ({
	deleteFormSubmissionsBulkController: mockController(
		'formSubmission.deleteBulk',
	),
}));
vi.mock('../../controllers/formSubmission.restoreBulk', () => ({
	restoreFormSubmissionsBulkController: mockController(
		'formSubmission.restoreBulk',
	),
}));
vi.mock('../../controllers/formSubmission.purgeBulk', () => ({
	purgeFormSubmissionsBulkController: mockController(
		'formSubmission.purgeBulk',
	),
}));

import { formsApi } from '../route';

function buildApp() {
	const app = express();
	app.use(express.json());
	const router = express.Router();
	formsApi(router);
	app.use(router);
	return app;
}

describe('formsApi route ordering', () => {
	it('GET /forms/trash hits the trash controller, not get-by-id with id="trash"', async () => {
		const app = buildApp();
		const res = await request(app).get('/forms/trash');
		expect(res.body).toEqual({ controller: 'form.trash' });
	});

	it('DELETE /forms/bulk hits the bulk-delete controller, not single delete with id="bulk"', async () => {
		const app = buildApp();
		const res = await request(app).delete('/forms/bulk');
		expect(res.body).toEqual({ controller: 'form.deleteBulk' });
	});

	it('PATCH /forms/bulk/restore hits bulk-restore, not single restore with id="bulk"', async () => {
		const app = buildApp();
		const res = await request(app).patch('/forms/bulk/restore');
		expect(res.body).toEqual({ controller: 'form.restoreBulk' });
	});

	it('DELETE /forms/bulk/permanent hits bulk-purge, not single purge with id="bulk"', async () => {
		const app = buildApp();
		const res = await request(app).delete('/forms/bulk/permanent');
		expect(res.body).toEqual({ controller: 'form.purgeBulk' });
	});

	it('GET /forms/:id/submissions/trash hits the submission-trash controller, not get-by-id with submissionId="trash"', async () => {
		const app = buildApp();
		const res = await request(app).get('/forms/form-1/submissions/trash');
		expect(res.body).toEqual({ controller: 'formSubmission.trash' });
	});

	it('DELETE /forms/:id/submissions/bulk hits submission bulk-delete, not single delete with submissionId="bulk"', async () => {
		const app = buildApp();
		const res = await request(app).delete('/forms/form-1/submissions/bulk');
		expect(res.body).toEqual({ controller: 'formSubmission.deleteBulk' });
	});

	it('PATCH /forms/:id/submissions/bulk/restore hits submission bulk-restore, not single restore', async () => {
		const app = buildApp();
		const res = await request(app).patch(
			'/forms/form-1/submissions/bulk/restore',
		);
		expect(res.body).toEqual({ controller: 'formSubmission.restoreBulk' });
	});

	it('GET /forms/:id/submissions/:submissionId hits get-by-id for a real submission id', async () => {
		const app = buildApp();
		const res = await request(app).get(
			'/forms/form-1/submissions/some-real-id',
		);
		expect(res.body).toEqual({ controller: 'formSubmission.getById' });
	});

	it('POST /forms/:id/submissions (public submit) is reachable without auth', async () => {
		const app = buildApp();
		const res = await request(app).post('/forms/form-1/submissions').send({});
		expect(res.body).toEqual({ controller: 'formSubmission.submit' });
	});

	it('GET /forms/public/:id (public) is reachable without auth', async () => {
		const app = buildApp();
		const res = await request(app).get('/forms/public/form-1');
		expect(res.body).toEqual({ controller: 'form.getByIdPublic' });
	});

	it('registers routes on the router without throwing', () => {
		const router = express.Router();
		expect(() => formsApi(router)).not.toThrow();
	});
});
