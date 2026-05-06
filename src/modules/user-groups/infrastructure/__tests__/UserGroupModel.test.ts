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

import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

describe('UserGroupModel', () => {
	it('exports a model', () => {
		expect(UserGroupModel).toBeDefined();
	});

	it('permissions validator returns true for a valid permission', () => {
		const permPath = (UserGroupModel as unknown as MockModel).schema.path(
			'permissions',
		);
		const validate = permPath.validators[1].validator as (
			v: string[],
		) => boolean;
		expect(validate(['users:read'])).toBe(true);
	});

	it('permissions validator returns true for wildcard *:*', () => {
		const permPath = (UserGroupModel as unknown as MockModel).schema.path(
			'permissions',
		);
		const validate = permPath.validators[1].validator as (
			v: string[],
		) => boolean;
		expect(validate(['*:*'])).toBe(true);
	});

	it('permissions validator returns false for invalid permissions', () => {
		const permPath = (UserGroupModel as unknown as MockModel).schema.path(
			'permissions',
		);
		const validate = permPath.validators[1].validator as (
			v: string[],
		) => boolean;
		expect(validate(['not:a:valid:permission'])).toBe(false);
	});
});
