import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/subscribers/application/registerSubscriber', () => ({
	registerSubscriber: vi.fn(),
}));

import { subscriberRegister } from '@Modules/subscribers/controllers/subscriber.register';
import { registerSubscriber } from '@Modules/subscribers/application/registerSubscriber';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const validBody = {
	firstName: 'John',
	lastName: 'Doe',
	contactInformation: { email: 'john@test.com' },
	personalInformation: { gender: 'male' },
};

describe('subscriberRegister', () => {
	it('validates and calls registerSubscriber on a valid body, returns 201', async () => {
		vi.mocked(registerSubscriber).mockResolvedValue({ id: '1' } as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberRegister(req, res, next);
		expect(registerSubscriber).toHaveBeenCalledWith(
			expect.objectContaining({ firstName: 'John' }),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on an invalid body', async () => {
		const req = { body: { firstName: 'John' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberRegister(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
		expect(registerSubscriber).not.toHaveBeenCalled();
	});
});
