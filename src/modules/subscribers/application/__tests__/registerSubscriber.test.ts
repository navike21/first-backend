import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { registerSubscriber } from '@Modules/subscribers/application/registerSubscriber';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: { create: vi.fn() },
}));

type MockCreated = SubscriberSchema & {
	toObject: () => Record<string, unknown>;
};

describe('registerSubscriber', () => {
	it('creates a subscriber and returns cleaned data', async () => {
		// Arrange
		const input: SubscriberSchema = {
			firstName: 'Alice',
			lastName: 'Smith',
			contactInformation: { email: 'alice@example.com' },
			personalInformation: { gender: 'female' },
		};
		const created: MockCreated = {
			...input,
			id: 's1',
			toObject: vi.fn().mockReturnValue({
				id: 's1',
				firstName: 'Alice',
				lastName: 'Smith',
				_id: 'mongo-1',
			}),
		};
		vi.mocked(SubscriberModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<SubscriberSchema>[],
		);

		// Act
		const result = await registerSubscriber(input);

		// Assert — registerSubscriber adds `id` and wraps personalInformation, so use objectContaining
		expect(SubscriberModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ firstName: 'Alice', lastName: 'Smith' }),
		);
		expect(result.data).not.toHaveProperty('_id');
		expect(result.data.firstName).toBe('Alice');
	});
});
