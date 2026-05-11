import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { SubscriberSchema } from '@Modules/subscribers/types/subscriber.schema';
import { AppError } from '@Shared/domain/AppError';
import { registerSubscriberBulk } from '@Modules/subscribers/application/registerSubscriberBulk';
import SubscriberModel from '@Modules/subscribers/infrastructure/SubscriberModel';

vi.mock('@Modules/subscribers/infrastructure/SubscriberModel', () => ({
	default: { insertMany: vi.fn() },
}));

const baseSubscribers: SubscriberSchema[] = [
	{
		firstName: 'Alice',
		lastName: 'Smith',
		contactInformation: { email: 'alice@example.com' },
		personalInformation: { gender: 'female' },
	},
];

type MockCreated = SubscriberSchema & {
	toObject: () => Record<string, unknown>;
};

describe('registerSubscriberBulk', () => {
	it('inserts and returns cleaned subscriber data', async () => {
		// Arrange
		const created: MockCreated[] = [
			{
				...baseSubscribers[0],
				id: 's1',
				toObject: vi
					.fn()
					.mockReturnValue({ id: 's1', firstName: 'Alice', _id: 'mongo' }),
			},
		];
		vi.mocked(SubscriberModel.insertMany).mockResolvedValue(
			created as unknown as HydratedDocument<SubscriberSchema>[],
		);

		// Act
		const result = await registerSubscriberBulk(baseSubscribers);

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0]).not.toHaveProperty('_id');
	});

	it('throws AppError with 409 on duplicate key error (code 11000)', async () => {
		// Arrange
		const dupError = {
			code: 11000,
			keyPattern: { email: 1 },
			keyValue: { email: 'alice@example.com' },
		};
		vi.mocked(SubscriberModel.insertMany).mockRejectedValue(dupError);

		// Act & Assert
		await expect(
			registerSubscriberBulk(baseSubscribers),
		).rejects.toBeInstanceOf(AppError);
	});

	it('throws AppError with 409 when code 11000 but keyPattern is undefined', async () => {
		// Arrange
		const dupError = {
			code: 11000,
			keyPattern: undefined,
			keyValue: undefined,
		};
		vi.mocked(SubscriberModel.insertMany).mockRejectedValue(dupError);

		// Act & Assert
		await expect(
			registerSubscriberBulk(baseSubscribers),
		).rejects.toBeInstanceOf(AppError);
	});

	it('throws AppError with 400 on validation errors', async () => {
		// Arrange
		const validationError = { errors: { firstName: 'required' } };
		vi.mocked(SubscriberModel.insertMany).mockRejectedValue(validationError);

		// Act & Assert
		await expect(
			registerSubscriberBulk(baseSubscribers),
		).rejects.toBeInstanceOf(AppError);
	});

	it('rethrows unexpected errors', async () => {
		// Arrange
		const unknownError = new Error('database down');
		vi.mocked(SubscriberModel.insertMany).mockRejectedValue(unknownError);

		// Act & Assert
		await expect(registerSubscriberBulk(baseSubscribers)).rejects.toThrow(
			'database down',
		);
	});
});
