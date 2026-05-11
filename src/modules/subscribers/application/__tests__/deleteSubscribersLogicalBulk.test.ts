import { describe, it, expect, vi } from 'vitest';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { deleteSubscribersLogicalBulk } from '@Modules/subscribers/application/deleteSubscribersLogicalBulk';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: {
		find: vi.fn(),
		updateMany: vi.fn(),
	},
}));

type MockSubscriber = Pick<SubscriberSchema, 'id' | 'firstName' | 'status'>;

function buildFindChain(data: MockSubscriber[]) {
	return { lean: vi.fn().mockResolvedValue(data) };
}

describe('deleteSubscribersLogicalBulk', () => {
	it('logically deletes found active subscribers and reports not-found ids', async () => {
		// Arrange
		const found: MockSubscriber[] = [
			{ id: 's1', firstName: 'Alice', status: 'active' },
		];
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain(found) as unknown as ReturnType<
				typeof SubscriberModel.find
			>,
		);
		vi.mocked(SubscriberModel.updateMany).mockResolvedValue(undefined as never);

		// Act
		const result = await deleteSubscribersLogicalBulk([
			's1',
			'inactive-or-missing',
		]);

		// Assert
		expect(result.deletedIds).toEqual(['s1']);
		expect(result.notFoundOrInactiveIds).toEqual(['inactive-or-missing']);
		expect(SubscriberModel.updateMany).toHaveBeenCalled();
	});

	it('returns empty arrays and skips updateMany when no active subscribers found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof SubscriberModel.find>,
		);

		// Act
		const result = await deleteSubscribersLogicalBulk(['s-inactive']);

		// Assert
		expect(result.deleted).toEqual([]);
		expect(result.deletedIds).toEqual([]);
		expect(result.notFoundOrInactiveIds).toEqual(['s-inactive']);
		expect(SubscriberModel.updateMany).not.toHaveBeenCalled();
	});
});
