import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getClientById } from '@Modules/clients/application/getClientById';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import { ClientNotFoundError } from '@Modules/clients/domain/errors/ClientErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('getClientById', () => {
	it('returns client data when found', async () => {
		vi.mocked(ClientModel.findOne).mockReturnValue(mockQueryBuilder({ id: '1', businessName: 'Acme', _id: 'mongo1' }) as never);

		const result = await getClientById('1');

		expect(result).not.toHaveProperty('_id');
		expect(result.businessName).toBe('Acme');
	});

	it('throws ClientNotFoundError when not found', async () => {
		vi.mocked(ClientModel.findOne).mockReturnValue(mockQueryBuilder(null) as never);

		await expect(getClientById('not-found')).rejects.toThrow(ClientNotFoundError);
	});
});
