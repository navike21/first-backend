import { describe, it, expect, vi } from 'vitest';
import type { UserGroupDocument } from '@Modules/user-groups/infrastructure/UserGroupModel';
import { listUserGroups } from '@Modules/user-groups/application/listUserGroups';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

vi.mock('@Modules/user-groups/infrastructure/UserGroupModel', () => ({
	default: {
		find: vi.fn(),
		countDocuments: vi.fn(),
	},
}));

type MockGroup = Pick<UserGroupDocument, 'id' | 'name' | 'slug'>;

function buildFindChain(data: MockGroup[]) {
	return {
		sort: vi.fn().mockReturnValue({
			skip: vi.fn().mockReturnValue({
				limit: vi.fn().mockResolvedValue(data),
			}),
		}),
	};
}

describe('listUserGroups', () => {
	it('returns paginated groups', async () => {
		// Arrange
		const groups: MockGroup[] = [{ id: 'g1', name: 'Admin', slug: 'admin' }];
		vi.mocked(UserGroupModel.find).mockReturnValue(
			buildFindChain(groups) as unknown as ReturnType<
				typeof UserGroupModel.find
			>,
		);
		vi.mocked(UserGroupModel.countDocuments).mockResolvedValue(
			1 as unknown as Awaited<ReturnType<typeof UserGroupModel.countDocuments>>,
		);

		// Act
		const result = await listUserGroups({ page: 1, limit: 10 });

		// Assert
		expect(result.items).toHaveLength(1);
		expect(result.total).toBe(1);
	});

	it('applies status filter when provided', async () => {
		// Arrange
		vi.mocked(UserGroupModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof UserGroupModel.find>,
		);
		vi.mocked(UserGroupModel.countDocuments).mockResolvedValue(
			0 as unknown as Awaited<ReturnType<typeof UserGroupModel.countDocuments>>,
		);

		// Act
		await listUserGroups({ page: 1, limit: 10, status: 'active' });

		// Assert
		expect(UserGroupModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'active' }),
		);
	});

	it('applies name search filter when provided', async () => {
		// Arrange
		vi.mocked(UserGroupModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof UserGroupModel.find>,
		);
		vi.mocked(UserGroupModel.countDocuments).mockResolvedValue(
			0 as unknown as Awaited<ReturnType<typeof UserGroupModel.countDocuments>>,
		);

		// Act
		await listUserGroups({ page: 1, limit: 10, search: 'admin' });

		// Assert
		expect(UserGroupModel.find).toHaveBeenCalledWith(
			expect.objectContaining({
				name: expect.objectContaining({ $regex: 'admin' }),
			}),
		);
	});
});
