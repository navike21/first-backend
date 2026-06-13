import { describe, it, expect, vi } from 'vitest';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { AppError } from '@Shared/domain/AppError';
import { deleteSubscriberLogical } from '@Modules/subscribers/application/deleteSubscriberLogical';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: {
		findOne: vi.fn(),
		findOneAndUpdate: vi.fn(),
	},
}));

type MockSubscriber = Pick<
	SubscriberSchema,
	'id' | 'firstName' | 'lastName' | 'status'
>;

function buildFindOneChain(data: MockSubscriber | null) {
	return { lean: vi.fn().mockResolvedValue(data) };
}

describe('deleteSubscriberLogical', () => {
	it('logically deletes an active subscriber', async () => {
		// Arrange
		const subscriber: MockSubscriber = {
			id: 's1',
			firstName: 'Alice',
			lastName: 'Smith',
			status: 'active',
		};
		vi.mocked(SubscriberModel.findOne).mockReturnValue(
			buildFindOneChain(subscriber) as unknown as ReturnType<
				typeof SubscriberModel.findOne
			>,
		);
		vi.mocked(SubscriberModel.findOneAndUpdate).mockResolvedValue(null);

		// Act
		const result = await deleteSubscriberLogical('s1');

		// Assert: soft-delete is recorded via deletedAt (not a status change).
		expect(SubscriberModel.findOneAndUpdate).toHaveBeenCalledWith(
			{ id: 's1', deletedAt: null },
			{ $set: { deletedAt: expect.any(Date) } },
		);
		expect(result).toMatchObject({ id: 's1' });
		expect((result as { deletedAt?: Date }).deletedAt).toBeInstanceOf(Date);
	});

	it('throws AppError when no active subscriber is found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.findOne).mockReturnValue(
			buildFindOneChain(null) as unknown as ReturnType<
				typeof SubscriberModel.findOne
			>,
		);

		// Act & Assert
		await expect(deleteSubscriberLogical('missing')).rejects.toBeInstanceOf(
			AppError,
		);
	});
});
