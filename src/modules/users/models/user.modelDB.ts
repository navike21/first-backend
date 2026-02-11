import { Schema, model } from 'mongoose';
import { v6 as uuid } from 'uuid';

import { USER_CUSTOMER, USER_ROLES_ARRAY } from '@Constants/userRole';
import { USER_GENDER_ARRAY } from '@Constants/userGender';
import { ACTIVE, STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { urlValidate } from '@Helpers/urlValidate';
import { emailValidate } from '@Helpers/emailValidate';
import { dateValidate } from '@Helpers/dateValidate';

import { UserSchema } from '../types/user.schema';

const UserModel = new Schema<UserSchema>(
	{
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
		adminInformation: {
			required: false,
			type: {
				password: {
					type: String,
					required: false,
					minLength: 8,
					select: false,
				},
				role: {
					type: [String],
					required: true,
					default: [USER_CUSTOMER],
					enum: USER_ROLES_ARRAY,
				},
			},
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
					maxLength: 300,
					minLength: 5,
				},
			},
		},
		personalInformation: {
			required: true,
			type: {
				profilePictureUrl: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				dateOfBirth: {
					type: Date,
					required: false,
					validate: {
						validator: (value: Date) => {
							if (!value) return true;
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
		socialMediaLinks: {
			required: false,
			type: {
				facebook: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				twitter: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				linkedIn: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				instagram: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				x: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				youTube: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				website: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
			},
		},
		status: {
			type: String,
			required: true,
			default: ACTIVE,
			enum: STATUS_REGISTER_ARRAY,
		},
	},
	{
		timestamps: true,
	},
);

export default model<UserSchema>('User', UserModel);
