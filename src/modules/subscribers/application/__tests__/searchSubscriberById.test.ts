import { describe, it, expect, vi } from 'vitest';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { AppError } from '@Shared/domain/AppError';
import { searchSubscriberById } from '@Modules/subscribers/application/searchSubscriberById';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockSubscriber = Pick<SubscriberSchema, 'id' | 'firstName' | 'lastName'>;

function buildFindOneChain(data: MockSubscriber | null) {
	return { lean: vi.fn().mockResolvedValue(data) };
}

describe('searchSubscriberById', () => {
	it('returns cleaned subscriber data when found', async () => {
		// Arrange
		const mockSub: MockSubscriber = {
			id: 's1',
			firstName: 'Alice',
			lastName: 'Smith',
		};
		vi.mocked(SubscriberModel.findOne).mockReturnValue(
			buildFindOneChain(mockSub) as unknown as ReturnType<
				typeof SubscriberModel.findOne
			>,
		);

		// Act
		const result = await searchSubscriberById('s1');

		// Assert
		expect(result).toMatchObject({ id: 's1', firstName: 'Alice' });
	});

	it('throws AppError when subscriber is not found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.findOne).mockReturnValue(
			buildFindOneChain(null) as unknown as ReturnType<
				typeof SubscriberModel.findOne
			>,
		);

		// Act & Assert
		await expect(searchSubscriberById('missing')).rejects.toBeInstanceOf(
			AppError,
		);
	});
});
