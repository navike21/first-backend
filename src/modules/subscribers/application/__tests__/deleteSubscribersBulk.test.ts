import { describe, it, expect, vi } from 'vitest';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { deleteSubscribersBulk } from '@Modules/subscribers/application/deleteSubscribersBulk';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: {
		find: vi.fn(),
		deleteMany: vi.fn(),
	},
}));

type MockSubscriber = Pick<SubscriberSchema, 'id' | 'firstName' | 'lastName'>;

function buildFindChain(data: MockSubscriber[]) {
	return { lean: vi.fn().mockResolvedValue(data) };
}

describe('deleteSubscribersBulk', () => {
	it('deletes found subscribers and reports not-found ids', async () => {
		// Arrange
		const found: MockSubscriber[] = [
			{ id: 's1', firstName: 'Alice', lastName: 'Smith' },
		];
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain(found) as unknown as ReturnType<
				typeof SubscriberModel.find
			>,
		);
		vi.mocked(SubscriberModel.deleteMany).mockResolvedValue(undefined as never);

		// Act
		const result = await deleteSubscribersBulk(['s1', 'missing']);

		// Assert
		expect(result.deletedIds).toEqual(['s1']);
		expect(result.notFoundIds).toEqual(['missing']);
		expect(SubscriberModel.deleteMany).toHaveBeenCalled();
	});

	it('returns empty arrays and skips deleteMany when no subscribers are found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof SubscriberModel.find>,
		);

		// Act
		const result = await deleteSubscribersBulk(['unknown1', 'unknown2']);

		// Assert
		expect(result.deleted).toEqual([]);
		expect(result.deletedIds).toEqual([]);
		expect(result.notFoundIds).toEqual(['unknown1', 'unknown2']);
		expect(SubscriberModel.deleteMany).not.toHaveBeenCalled();
	});
});
