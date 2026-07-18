import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { withMongo } from '@test/withMongo';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock(
	'@Modules/notifications-email/infrastructure/transport/getEmailTransport',
	() => ({ getEmailTransport: () => ({ name: 'mock', send: sendMock }) }),
);

import { notificationsEmailApi } from '@Modules/notifications-email';
import EmailOutboxModel from '@Modules/notifications-email/infrastructure/EmailOutboxModel';

function buildApp() {
	const app = express();
	app.use(express.json());
	const router = express.Router();
	notificationsEmailApi(router);
	app.use('/api/v1', router);
	return app;
}

const seed = () =>
	EmailOutboxModel.create({
		to: 'a@b.com',
		subject: 'S',
		html: '<p/>',
		from: 'from@x.com',
		status: 'pending',
		attempts: 0,
		maxAttempts: 3,
	});

describe('POST /emails/dispatch (integration)', () => {
	withMongo();

	beforeEach(() => {
		sendMock.mockReset();
		sendMock.mockResolvedValue(undefined);
	});

	it('drains the outbox end-to-end (route → guard → controller → dispatch)', async () => {
		await seed();
		await seed();

		const res = await request(buildApp()).post('/api/v1/emails/dispatch');

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({ processed: 2, sent: 2 });
		expect(await EmailOutboxModel.countDocuments({ status: 'sent' })).toBe(2);
	});
});
