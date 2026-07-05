import { model, Schema } from 'mongoose';
import { SubscriberSchema } from '../types/subscriber.schema';
import { emailValidate } from '@Helpers/emailValidate';
import { dateValidate } from '@Helpers/dateValidate';
import { USER_GENDER_ARRAY } from '@Constants/userGender';
import generateUUID from '@Helpers/uuid';

const subscriberSchema = new Schema<SubscriberSchema>({
	id: {
		type: String,
		required: true,
		unique: true,
		default: generateUUID(),
	},
	firstName: {
		type: String,
		required: true,
		maxLength: 50,
		minLength: 2,
	},
	lastName: {
		type: String,
		required: true,
		maxLength: 100,
		minLength: 2,
	},
	contactInformation: {
		required: true,
		type: {
			email: {
				type: String,
				required: true,
				unique: true,
				validate: {
					validator: (value: string) => emailValidate(value),
				},
			},
			phoneNumber: {
				type: String,
				required: false,
				maxLength: 20,
			},
		},
	},
	location: {
		required: false,
		type: {
			countryCode: { type: String, required: false, maxLength: 2 },
			ubigeoCode: { type: String, required: false, maxLength: 10 },
			region: { type: String, required: false, maxLength: 100 },
			province: { type: String, required: false, maxLength: 100 },
			district: { type: String, required: false, maxLength: 100 },
			address: { type: String, required: false, maxLength: 300 },
			addressNumber: { type: String, required: false, maxLength: 50 },
			addressInterior: { type: String, required: false, maxLength: 100 },
		},
	},
	personalInformation: {
		type: {
			profilePictureUrl: {
				type: String,
				required: false,
			},
			dateOfBirth: {
				type: Date,
				required: false,
				validate: {
					validator: (value: Date) => dateValidate(value),
				},
			},
			gender: {
				type: String,
				required: true,
				enum: USER_GENDER_ARRAY,
			},
		},
	},
	status: {
		type: String,
		required: true,
		default: 'active',
		enum: ['active', 'inactive'],
	},
	deletedAt: {
		type: Date,
		default: null,
	},
});

export default model<SubscriberSchema>('Subscriber', subscriberSchema);
