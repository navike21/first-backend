import request from 'supertest';
import express, { type Router } from 'express';
import { describe, it, expect, vi } from 'vitest';
import type { Response } from 'express';
import type { SuccessResponseOptions } from '@Types/responseStructure';

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: <T>(
		res: Response,
		options: SuccessResponseOptions<T>,
	): Response =>
		res
			.status(options.statusCode ?? 200)
			.json({ message: options.message, data: options.data }),
}));

import { welcomeApi } from '@Modules/welcomeApi';

describe('Welcome API', () => {
	it('GET / responds with 200 and API information', async () => {
		// Arrange
		const app = express();
		welcomeApi(app as unknown as Router);

		// Act
		const response = await request(app).get('/');

		// Assert
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
	});
});
