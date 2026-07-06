import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { AppError } from '@Shared/domain/AppError';
import { updateSubscriber } from '@Modules/subscribers/application/updateSubscriber';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: { findOne: vi.fn() },
}));

vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn().mockResolvedValue({}),
	deleteEntityFiles: vi.fn().mockResolvedValue(undefined),
	deleteStorageFilesByIds: vi.fn().mockResolvedValue(undefined),
}));

type MockDoc = Partial<SubscriberSchema> & {
	save: () => Promise<void>;
	toObject: () => Record<string, unknown>;
};

describe('updateSubscriber', () => {
	it('updates and returns cleaned subscriber data', async () => {
		// Arrange — updateSubscriber uses findOne + Object.assign + save()
		const mockDoc: MockDoc = {
			id: 's1',
			firstName: 'Alice Updated',
			lastName: 'Smith',
			save: vi.fn().mockResolvedValue(undefined),
			toObject: vi.fn().mockReturnValue({
				id: 's1',
				firstName: 'Alice Updated',
				_id: 'mongo',
			}),
		};
		vi.mocked(SubscriberModel.findOne).mockResolvedValue(
			mockDoc as unknown as HydratedDocument<SubscriberSchema>,
		);

		// Act
		const result = await updateSubscriber('s1', { firstName: 'Alice Updated' });

		// Assert
		expect(result.data).not.toHaveProperty('_id');
		expect(result.data.firstName).toBe('Alice Updated');
	});

	it('throws AppError when subscriber is not found', async () => {
		// Arrange
		vi.mocked(SubscriberModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			updateSubscriber('missing', { firstName: 'X' }),
		).rejects.toBeInstanceOf(AppError);
	});
});
