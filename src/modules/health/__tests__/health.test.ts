import request from 'supertest';
import express, { type Router } from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response } from 'express';
import type {
	SuccessResponseOptions,
	ErrorResponseOptions,
} from '@Types/responseStructure';

const mongooseConnection = vi.hoisted(() => ({ readyState: 1 }));

vi.mock('mongoose', () => ({
	default: { connection: mongooseConnection },
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: <T>(
		res: Response,
		options: SuccessResponseOptions<T>,
	): Response => res.status(options.statusCode ?? 200).json(options.data),
	errorResponse: (res: Response, options: ErrorResponseOptions): Response =>
		res.status(options.statusCode).json({
			message: options.message,
			statusCode: options.statusCode,
			success: false,
		}),
}));

import { healthApi } from '@Modules/health';

describe('Health API', () => {
	const app = express();
	healthApi(app as unknown as Router);

	beforeEach(() => {
		mongooseConnection.readyState = 1;
	});

	it('responds 200 when DB is connected (readyState = 1)', async () => {
		// Arrange
		mongooseConnection.readyState = 1;

		// Act
		const response = await request(app).get('/health');

		// Assert
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('status', 'ok');
		expect(response.body).toHaveProperty('db', 'connected');
	});

	it('responds 503 when DB is disconnected (readyState = 0)', async () => {
		// Arrange
		mongooseConnection.readyState = 0;

		// Act
		const response = await request(app).get('/health');

		// Assert
		expect(response.status).toBe(503);
		expect(response.body).toHaveProperty('success', false);
	});

	it('responds 503 when DB is connecting (readyState = 2)', async () => {
		// Arrange
		mongooseConnection.readyState = 2;

		// Act
		const response = await request(app).get('/health');

		// Assert
		expect(response.status).toBe(503);
		expect(response.body).toHaveProperty('success', false);
	});
});
