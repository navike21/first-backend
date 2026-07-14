import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';
import { SubscriberSchema } from '../types/subscriber.schema';

export async function registerSubscriberBulk(data: SubscriberSchema[]) {
	try {
		const created = await SubscriberModel.insertMany(data, { ordered: false });
		return created.map((s) =>
			cleanMongoFields(s.toObject({ versionKey: false, getters: true })),
		);
	} catch (error: unknown) {
		const mongoError = error as {
			code?: number;
			keyPattern?: object;
			keyValue?: unknown;
			errors?: unknown;
		};

		if (mongoError.code === 11000) {
			AppError.conflict(
				'ERROR_DUPLICATE_SUBSCRIBER',
				'One or more subscribers already exist with duplicate unique fields',
				{
					duplicateField: Object.keys(mongoError.keyPattern ?? {}),
					duplicateValue: mongoError.keyValue,
				},
			);
		}

		if (mongoError.errors) {
			AppError.badRequest(
				'ERROR_VALIDATION_FAILED',
				'Validation error in one or more subscribers',
				mongoError.errors,
			);
		}

		throw error;
	}
}
