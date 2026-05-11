import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/log', () => ({ logInfo: vi.fn(), logError: vi.fn() }));

type SchemaPath = { validators: Array<{ validator: unknown }> };
type MockModel = (new () => unknown) & {
	schema: { path(key: string): SchemaPath };
};

vi.mock('mongoose', async (importOriginal) => {
	const actual = await importOriginal<typeof import('mongoose')>();
	return {
		...actual,
		model: vi.fn().mockImplementation((_name: string, schema: unknown) => {
			const M = Object.assign(function () {}, { schema }) as unknown as MockModel;
			return M;
		}),
	};
});

import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

describe('SubscriberModel', () => {
	it('exports a model', () => {
		expect(SubscriberModel).toBeDefined();
	});

	it('email validator returns true for a valid email', () => {
		const emailPath = (SubscriberModel as unknown as MockModel).schema.path(
			'contactInformation.email',
		);
		const validate = emailPath.validators[1].validator as (
			v: string,
		) => boolean;
		expect(validate('test@example.com')).toBe(true);
	});

	it('email validator returns false for an invalid email', () => {
		const emailPath = (SubscriberModel as unknown as MockModel).schema.path(
			'contactInformation.email',
		);
		const validate = emailPath.validators[1].validator as (
			v: string,
		) => boolean;
		expect(validate('not-an-email')).toBe(false);
	});

	it('dateOfBirth validator returns true for a valid date', () => {
		const dobPath = (SubscriberModel as unknown as MockModel).schema.path(
			'personalInformation.dateOfBirth',
		);
		const validate = dobPath.validators[0].validator as (v: Date) => boolean;
		expect(validate(new Date('1990-01-01'))).toBe(true);
	});

	it('dateOfBirth validator returns false for an invalid date', () => {
		const dobPath = (SubscriberModel as unknown as MockModel).schema.path(
			'personalInformation.dateOfBirth',
		);
		const validate = dobPath.validators[0].validator as (v: Date) => boolean;
		expect(validate(new Date('not-a-date'))).toBe(false);
	});
});
