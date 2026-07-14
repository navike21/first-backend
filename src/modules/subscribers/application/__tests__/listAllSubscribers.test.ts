import { describe, it, expect, vi } from 'vitest';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { listAllSubscribers } from '@Modules/subscribers/application/listAllSubscribers';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: {
		find: vi.fn(),
		countDocuments: vi.fn(),
	},
}));

type MockSubscriber = Pick<SubscriberSchema, 'id' | 'firstName' | 'lastName'>;

function buildFindChain(data: MockSubscriber[]) {
	return {
		skip: vi.fn().mockReturnValue({
			limit: vi.fn().mockReturnValue({
				select: vi.fn().mockReturnValue({
					lean: vi.fn().mockResolvedValue(data),
				}),
			}),
		}),
	};
}

describe('Subscribers listAllSubscribers', () => {
	it('returns paginated data and meta when subscribers exist', async () => {
		// Arrange
		const mockSubscribers: MockSubscriber[] = [
			{ id: 's1', firstName: 'Alice', lastName: 'Smith' },
			{ id: 's2', firstName: 'Bob', lastName: 'Jones' },
		];
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain(mockSubscribers) as unknown as ReturnType<
				typeof SubscriberModel.find
			>,
		);
		vi.mocked(SubscriberModel.countDocuments).mockResolvedValue(
			2 as unknown as Awaited<
				ReturnType<typeof SubscriberModel.countDocuments>
			>,
		);

		// Act
		const result = await listAllSubscribers({ limit: 2, page: 1 });

		// Assert
		expect(result.data).toHaveLength(2);
		expect(result.meta).toMatchObject({ page: 1, limit: 2, total: 2 });
	});

	it('returns empty data and meta when subscriber list is empty', async () => {
		// Arrange
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof SubscriberModel.find>,
		);
		vi.mocked(SubscriberModel.countDocuments).mockResolvedValue(
			0 as unknown as Awaited<
				ReturnType<typeof SubscriberModel.countDocuments>
			>,
		);

		// Act
		const result = await listAllSubscribers({ limit: 10, page: 1 });

		// Assert
		expect(result.data).toHaveLength(0);
		expect(result.meta).toMatchObject({ total: 0 });
	});

	it('filters subscribers by the provided status', async () => {
		// Arrange
		const mockSubscribers: MockSubscriber[] = [
			{ id: 's3', firstName: 'Charlie', lastName: 'Brown' },
		];
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain(mockSubscribers) as unknown as ReturnType<
				typeof SubscriberModel.find
			>,
		);
		vi.mocked(SubscriberModel.countDocuments).mockResolvedValue(
			1 as unknown as Awaited<
				ReturnType<typeof SubscriberModel.countDocuments>
			>,
		);

		// Act
		const result = await listAllSubscribers({
			limit: 10,
			page: 1,
			status: 'inactive',
		});

		// Assert
		expect(SubscriberModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'inactive' }),
		);
		expect(result.data).toHaveLength(1);
	});

	it('applies search filter across name and email fields', async () => {
		// Arrange
		const mockSubscribers: MockSubscriber[] = [
			{ id: 's4', firstName: 'Diana', lastName: 'Prince' },
		];
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain(mockSubscribers) as unknown as ReturnType<
				typeof SubscriberModel.find
			>,
		);
		vi.mocked(SubscriberModel.countDocuments).mockResolvedValue(
			1 as unknown as Awaited<
				ReturnType<typeof SubscriberModel.countDocuments>
			>,
		);

		// Act
		const result = await listAllSubscribers({
			limit: 10,
			page: 1,
			search: 'diana',
		});

		// Assert
		expect(SubscriberModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ $or: expect.any(Array) }),
		);
		expect(result.data).toHaveLength(1);
	});
});
