import { describe, it, expect, vi } from 'vitest';

vi.mock('mongoose', async (importOriginal) => {
	const actual = await importOriginal<typeof import('mongoose')>();
	return {
		...actual,
		model: vi.fn().mockReturnValue({ modelName: 'Session' }),
	};
});

import SessionModel from '@Modules/auth/infrastructure/SessionModel';

describe('SessionModel', () => {
	it('exports a model', () => {
		expect(SessionModel).toBeDefined();
	});
});
