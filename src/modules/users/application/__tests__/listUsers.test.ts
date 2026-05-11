import { describe, it, expect, vi } from 'vitest';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { listUsers } from '@Modules/users/application/listUsers';
import UserModel from '@Modules/users/infrastructure/UserModel';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: {
		find: vi.fn(),
		countDocuments: vi.fn(),
	},
}));

type MockUser = Pick<UserDocument, 'id' | 'firstName' | 'lastName' | 'email'>;

function buildFindChain(data: MockUser[]) {
	return {
		select: vi.fn().mockReturnValue({
			sort: vi.fn().mockReturnValue({
				skip: vi.fn().mockReturnValue({
					limit: vi.fn().mockResolvedValue(data),
				}),
			}),
		}),
	};
}

describe('listUsers', () => {
	it('returns paginated users with total count', async () => {
		// Arrange
		const users: MockUser[] = [
			{
				id: 'u1',
				firstName: 'Alice',
				lastName: 'Smith',
				email: 'alice@example.com',
			},
		];
		vi.mocked(UserModel.find).mockReturnValue(
			buildFindChain(users) as unknown as ReturnType<typeof UserModel.find>,
		);
		vi.mocked(UserModel.countDocuments).mockResolvedValue(
			1 as unknown as Awaited<ReturnType<typeof UserModel.countDocuments>>,
		);

		// Act
		const result = await listUsers({ page: 1, limit: 10 });

		// Assert
		expect(result.items).toHaveLength(1);
		expect(result.total).toBe(1);
		expect(result.page).toBe(1);
		expect(result.pages).toBe(1);
	});

	it('applies status filter when provided', async () => {
		// Arrange
		vi.mocked(UserModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof UserModel.find>,
		);
		vi.mocked(UserModel.countDocuments).mockResolvedValue(
			0 as unknown as Awaited<ReturnType<typeof UserModel.countDocuments>>,
		);

		// Act
		await listUsers({ page: 1, limit: 10, status: 'active' });

		// Assert
		expect(UserModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'active' }),
		);
	});

	it('applies groupId filter when provided', async () => {
		// Arrange
		vi.mocked(UserModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof UserModel.find>,
		);
		vi.mocked(UserModel.countDocuments).mockResolvedValue(
			0 as unknown as Awaited<ReturnType<typeof UserModel.countDocuments>>,
		);

		// Act
		await listUsers({ page: 1, limit: 10, groupId: 'g1' });

		// Assert
		expect(UserModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ groupId: 'g1' }),
		);
	});

	it('applies search $or filter when search is provided', async () => {
		// Arrange
		vi.mocked(UserModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof UserModel.find>,
		);
		vi.mocked(UserModel.countDocuments).mockResolvedValue(
			0 as unknown as Awaited<ReturnType<typeof UserModel.countDocuments>>,
		);

		// Act
		await listUsers({ page: 1, limit: 10, search: 'alice' });

		// Assert
		expect(UserModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ $or: expect.any(Array) }),
		);
	});

	it('skips correctly for page 2', async () => {
		// Arrange
		const skipMock = vi
			.fn()
			.mockReturnValue({ limit: vi.fn().mockResolvedValue([]) });
		vi.mocked(UserModel.find).mockReturnValue({
			select: vi.fn().mockReturnValue({
				sort: vi.fn().mockReturnValue({ skip: skipMock }),
			}),
		} as unknown as ReturnType<typeof UserModel.find>);
		vi.mocked(UserModel.countDocuments).mockResolvedValue(
			25 as unknown as Awaited<ReturnType<typeof UserModel.countDocuments>>,
		);

		// Act
		await listUsers({ page: 2, limit: 10 });

		// Assert
		expect(skipMock).toHaveBeenCalledWith(10);
	});
});
