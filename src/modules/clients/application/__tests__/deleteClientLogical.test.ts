import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deleteClientLogical } from '@Modules/clients/application/deleteClientLogical';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import { ClientNotFoundError } from '@Modules/clients/domain/errors/ClientErrors';

describe('deleteClientLogical', () => {
	it('soft-deletes client and returns data', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const clientDoc = {
			id: '1',
			status: 'active',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', status: 'deleted', _id: 'mongo1' }),
		};
		vi.mocked(ClientModel.findOne).mockResolvedValue(clientDoc as never);

		const result = await deleteClientLogical('1');

		expect(saveFn).toHaveBeenCalled();
		expect(clientDoc.status).toBe('deleted');
		expect(result).not.toHaveProperty('_id');
	});

	it('throws ClientNotFoundError when client does not exist', async () => {
		vi.mocked(ClientModel.findOne).mockResolvedValue(null as never);

		await expect(deleteClientLogical('not-found')).rejects.toThrow(
			ClientNotFoundError,
		);
	});
});
