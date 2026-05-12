import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

import { createClient } from '@Modules/clients/application/createClient';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import { ClientBusinessNameConflictError } from '@Modules/clients/domain/errors/ClientErrors';

const validInput = {
	businessName: 'Acme Corp',
	clientType: 'company' as const,
	country: 'PE',
};

describe('createClient', () => {
	it('creates a client and returns cleaned data', async () => {
		vi.mocked(ClientModel.findOne).mockResolvedValue(null);
		vi.mocked(ClientModel.create).mockResolvedValue({
			...validInput,
			id: 'uuid-1',
			toObject: vi.fn().mockReturnValue({ ...validInput, id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		const result = await createClient(validInput);

		expect(ClientModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws ClientBusinessNameConflictError when name exists', async () => {
		vi.mocked(ClientModel.findOne).mockResolvedValue({ id: 'existing' } as never);

		await expect(createClient(validInput)).rejects.toThrow(ClientBusinessNameConflictError);
	});
});
