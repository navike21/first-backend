import { describe, it, expect, vi } from 'vitest';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { AppError } from '@Shared/domain/AppError';
import { deleteSubscriber } from '@Modules/subscribers/application/deleteSubscriber';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: { findOneAndDelete: vi.fn() },
}));

type MockSubscriber = Pick<SubscriberSchema, 'id' | 'firstName' | 'lastName'>;

function buildDeleteChain(data: MockSubscriber | null) {
	return { lean: vi.fn().mockResolvedValue(data) };
}

describe('deleteSubscriber', () => {
	it('deletes and returns cleaned subscriber data', async () => {
		// Arrange
		const deleted: MockSubscriber = {
			id: 's1',
			firstName: 'Alice',
			lastName: 'Smith',
		};
		vi.mocked(SubscriberModel.findOneAndDelete).mockReturnValue(
			buildDeleteChain(deleted) as unknown as ReturnType<
				typeof SubscriberModel.findOneAndDelete
			>,
		);

		// Act
		const result = await deleteSubscriber('s1');

		// Assert
		expect(SubscriberModel.findOneAndDelete).toHaveBeenCalledWith({ id: 's1' });
		expect(result).toMatchObject({ id: 's1', firstName: 'Alice' });
	});

	it('throws AppError when subscriber is not found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.findOneAndDelete).mockReturnValue(
			buildDeleteChain(null) as unknown as ReturnType<
				typeof SubscriberModel.findOneAndDelete
			>,
		);

		// Act & Assert
		await expect(deleteSubscriber('missing')).rejects.toBeInstanceOf(AppError);
	});
});
