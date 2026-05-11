import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { AppError } from '@Shared/domain/AppError';
import { updateSubscriber } from '@Modules/subscribers/application/updateSubscriber';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: { findOneAndUpdate: vi.fn() },
}));

type MockUpdated = Pick<SubscriberSchema, 'id' | 'firstName' | 'lastName'> & {
	toObject: () => Record<string, unknown>;
};

describe('updateSubscriber', () => {
	it('updates and returns cleaned subscriber data', async () => {
		// Arrange
		const updated: MockUpdated = {
			id: 's1',
			firstName: 'Alice Updated',
			lastName: 'Smith',
			toObject: vi.fn().mockReturnValue({
				id: 's1',
				firstName: 'Alice Updated',
				_id: 'mongo',
			}),
		};
		vi.mocked(SubscriberModel.findOneAndUpdate).mockResolvedValue(
			updated as unknown as HydratedDocument<SubscriberSchema>,
		);

		// Act
		const result = await updateSubscriber('s1', { firstName: 'Alice Updated' });

		// Assert
		expect(result).not.toHaveProperty('_id');
		expect(result.firstName).toBe('Alice Updated');
	});

	it('throws AppError when subscriber is not found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.findOneAndUpdate).mockResolvedValue(null);

		// Act & Assert
		await expect(
			updateSubscriber('missing', { firstName: 'X' }),
		).rejects.toBeInstanceOf(AppError);
	});
});
