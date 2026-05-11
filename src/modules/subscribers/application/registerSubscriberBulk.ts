import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
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
			setThrowError({
				statusCode: 409,
				message:
					'One or more subscribers already exist with duplicate unique fields',
				code: 'ERROR_DUPLICATE_SUBSCRIBER',
				details: {
					duplicateField: Object.keys(mongoError.keyPattern ?? {}),
					duplicateValue: mongoError.keyValue,
				},
			});
		}

		if (mongoError.errors) {
			setThrowError({
				statusCode: 400,
				message: 'Validation error in one or more subscribers',
				code: 'ERROR_VALIDATION_FAILED',
				details: mongoError.errors,
			});
		}

		throw error;
	}
}
