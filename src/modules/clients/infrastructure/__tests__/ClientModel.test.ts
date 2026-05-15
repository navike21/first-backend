import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import ClientModel from '@Modules/clients/infrastructure/ClientModel';

describe('ClientModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(ClientModel).toBeDefined();
		expect(typeof ClientModel.find).toBe('function');
		expect(typeof ClientModel.findOne).toBe('function');
		expect(typeof ClientModel.create).toBe('function');
	});
});
