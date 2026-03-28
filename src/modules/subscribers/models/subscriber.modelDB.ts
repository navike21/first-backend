import { model, Schema } from 'mongoose';
import { v6 as uuid } from 'uuid';
import { SubscriberSchema } from '../types/subscriber.schema';
import { emailValidate } from '@Helpers/emailValidate';
import { ACTIVE, STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { dateValidate } from '@Helpers/dateValidate';
import { USER_GENDER_ARRAY } from '@Constants/userGender';

const SubscriberModel = new Schema<SubscriberSchema>({
	id: {
		type: String,
		required: true,
		unique: true,
		default: uuid(),
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
					validator: (value: string) => {
						return emailValidate(value);
					},
				},
			},
			phoneNumber: {
				type: Number,
				required: false,
				minLength: 9,
				maxLength: 15,
			},
			address: {
				type: String,
				required: false,
			},
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
				Validate: {
					validator: (value: Date) => {
						return dateValidate(value);
					},
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
		default: ACTIVE,
		enum: STATUS_REGISTER_ARRAY,
	},
});

export default model<SubscriberSchema>('Subscriber', SubscriberModel);
