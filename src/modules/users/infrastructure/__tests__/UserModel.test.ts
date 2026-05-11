import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/log', () => ({ logInfo: vi.fn(), logError: vi.fn() }));

vi.mock('mongoose', async (importOriginal) => {
	const actual = await importOriginal<typeof import('mongoose')>();
	return {
		...actual,
		model: vi.fn().mockReturnValue({ modelName: 'User' }),
	};
});

import UserModel from '@Modules/users/infrastructure/UserModel';

describe('UserModel', () => {
	it('exports a model', () => {
		expect(UserModel).toBeDefined();
	});
});
