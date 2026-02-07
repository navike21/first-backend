import { Schema, model } from 'mongoose';
import { v6 as uuid } from 'uuid';

import { USER_CUSTOMER, USER_ROLES_ARRAY } from '@Constants/userRole';
import { USER_GENDER_ARRAY } from '@Constants/userGender';
import { ACTIVE, STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { urlValidate } from '@Helpers/urlValidate';
import { emailValidate } from '@Helpers/emailValidate';
import { dateValidate } from '@Helpers/dateValidate';

import { UserSchema } from '../types/user.schema';
import {
	ADMIN_INFORMATION,
	CONTACT_INFORMATION,
	FIRST_NAME,
	LAST_NAME,
	PERSONAL_INFORMATION,
	STATUS,
} from '../constants/messagesCodes';

const userSchema = new Schema<UserSchema>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
			select: false,
			default: uuid(),
		},
		firstName: {
			type: String,
			required: [true, FIRST_NAME.REQUIRED],
			maxLength: [50, FIRST_NAME.MAX_LENGTH],
			minLength: [2, FIRST_NAME.MIN_LENGTH],
		},
		lastName: {
			type: String,
			required: [true, LAST_NAME.REQUIRED],
			maxLength: [100, LAST_NAME.MAX_LENGTH],
			minLength: [2, LAST_NAME.MIN_LENGTH],
		},
		adminInformation: {
			required: false,
			type: {
				password: {
					type: String,
					required: [true, ADMIN_INFORMATION.PASSWORD.REQUIRED],
					minLength: [8, ADMIN_INFORMATION.PASSWORD.MIN_LENGTH],
					select: false,
				},
				role: {
					type: [String],
					required: [true, ADMIN_INFORMATION.ROLE.REQUIRED],
					default: [USER_CUSTOMER],
					enum: {
						values: USER_ROLES_ARRAY,
						message: ADMIN_INFORMATION.ROLE.ENUM,
					},
				},
			},
		},
		contactInformation: {
			required: true,
			type: {
				email: {
					type: String,
					required: [true, CONTACT_INFORMATION.EMAIL.REQUIRED],
					unique: [true, CONTACT_INFORMATION.EMAIL.UNIQUE],
					validate: {
						validator: (value: string) => {
							return emailValidate(value);
						},
						message: CONTACT_INFORMATION.EMAIL.VALID,
					},
				},
				phoneNumber: {
					type: Number,
					required: false,
					minLength: [9, CONTACT_INFORMATION.PHONE_NUMBER.MIN_LENGTH],
					maxLength: [15, CONTACT_INFORMATION.PHONE_NUMBER.MAX_LENGTH],
				},
				address: {
					type: String,
					required: false,
					maxLength: [300, CONTACT_INFORMATION.ADDRESS.MAX_LENGTH],
					minLength: [5, CONTACT_INFORMATION.ADDRESS.MIN_LENGTH],
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
						message: PERSONAL_INFORMATION.PROFILE_PICTURE.VALID,
					},
					select: false,
				},
				dateOfBirth: {
					type: Date,
					required: false,
					validate: {
						validator: (value: Date) => {
							if (!value) return true;
							return dateValidate(value);
						},
						message: PERSONAL_INFORMATION.DATE_OF_BIRTH.VALID,
					},
				},
				gender: {
					type: String,
					required: [true, PERSONAL_INFORMATION.GENDER.REQUIRED],
					enum: {
						values: USER_GENDER_ARRAY,
						message: PERSONAL_INFORMATION.GENDER.VALID,
					},
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
			enum: {
				values: STATUS_REGISTER_ARRAY,
				message: STATUS.ENUM,
			},
		},
	},
	{
		timestamps: true,
	},
);

export default model<UserSchema>('User', userSchema);
