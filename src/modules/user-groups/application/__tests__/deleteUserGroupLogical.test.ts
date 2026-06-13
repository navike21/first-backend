import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/user-groups/infrastructure/UserGroupModel', () => ({
	default: { findOne: vi.fn(), findOneAndUpdate: vi.fn() },
}));

import { deleteUserGroupLogical } from '@Modules/user-groups/application/deleteUserGroupLogical';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '@Modules/user-groups/domain/errors/UserGroupErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('deleteUserGroupLogical', () => {
	it('soft-deletes group and returns cleaned data', async () => {
		const group = { id: '1', name: 'Editors', isSystem: false, _id: 'mongo1' };
		vi.mocked(UserGroupModel.findOne).mockReturnValue(
			mockQueryBuilder(group) as never,
		);
		vi.mocked(UserGroupModel.findOneAndUpdate).mockResolvedValue({} as never);

		const result = await deleteUserGroupLogical('1');

		expect(UserGroupModel.findOneAndUpdate).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
		// Soft-delete is recorded via deletedAt (there is no 'deleted' status).
		expect((result as { deletedAt?: Date }).deletedAt).toBeInstanceOf(Date);
	});

	it('throws UserGroupNotFoundError when group does not exist', async () => {
		vi.mocked(UserGroupModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(deleteUserGroupLogical('not-found')).rejects.toThrow(
			UserGroupNotFoundError,
		);
	});

	it('throws SystemGroupModificationError for system groups', async () => {
		const group = { id: '1', name: 'Admin', isSystem: true, _id: 'mongo1' };
		vi.mocked(UserGroupModel.findOne).mockReturnValue(
			mockQueryBuilder(group) as never,
		);

		await expect(deleteUserGroupLogical('1')).rejects.toThrow(
			SystemGroupModificationError,
		);
	});
});
