import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateClient } from '@Modules/clients/application/updateClient';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import {
	ClientNotFoundError,
	ClientBusinessNameConflictError,
} from '@Modules/clients/domain/errors/ClientErrors';

describe('updateClient', () => {
	it('updates and returns client', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const clientDoc = {
			id: '1',
			businessName: 'Old Name',
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', businessName: 'New Name', _id: 'mongo1' }),
		};
		vi.mocked(ClientModel.findOne)
			.mockResolvedValueOnce(clientDoc as never)
			.mockResolvedValueOnce(null as never);

		const result = await updateClient('1', { businessName: 'New Name' });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws ClientNotFoundError when client does not exist', async () => {
		vi.mocked(ClientModel.findOne).mockResolvedValue(null as never);

		await expect(updateClient('not-found', { businessName: 'X' })).rejects.toThrow(ClientNotFoundError);
	});

	it('throws ClientBusinessNameConflictError on duplicate name', async () => {
		const clientDoc = { id: '1', businessName: 'Old', save: vi.fn() };
		const conflictDoc = { id: '2', businessName: 'New Name' };
		vi.mocked(ClientModel.findOne)
			.mockResolvedValueOnce(clientDoc as never)
			.mockResolvedValueOnce(conflictDoc as never);

		await expect(updateClient('1', { businessName: 'New Name' })).rejects.toThrow(ClientBusinessNameConflictError);
	});
});
