import { model, Schema } from 'mongoose';
import { USER_GENDER_ARRAY, UserGender } from '@Constants/userGender';
import {
	ACTIVE,
	STATUS_REGISTER_ARRAY,
	StatusRegister,
} from '@Constants/statusRegister';
import generateUUID from '@Helpers/uuid';

export interface AddressDocument {
	street?: string;
	city?: string;
	state?: string;
	country?: string;
	postalCode?: string;
}

export type PresenceStatus = 'available' | 'busy' | 'away' | 'offline';
export const PRESENCE_STATUS_ARRAY: PresenceStatus[] = ['available', 'busy', 'away', 'offline'];

export interface UserDocument {
	id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: Date;
	gender?: UserGender;
	phone?: string;
	profilePictureUrl?: string;
	address?: AddressDocument;
	groupId?: string;
	isEmailVerified: boolean;
	status: StatusRegister;
	presenceStatus: PresenceStatus;
	lastSeenAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const addressSchema = new Schema<AddressDocument>(
	{
		street: { type: String, maxlength: 255 },
		city: { type: String, maxlength: 100 },
		state: { type: String, maxlength: 100 },
		country: { type: String, maxlength: 100 },
		postalCode: { type: String, maxlength: 20 },
	},
	{ _id: false },
);

const userSchema = new Schema<UserDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: true },
		firstName: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 50,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			trim: true,
		},
		dateOfBirth: { type: Date },
		gender: { type: String, enum: USER_GENDER_ARRAY },
		phone: { type: String, maxlength: 30, trim: true },
		profilePictureUrl: { type: String, maxlength: 500 },
		address: { type: addressSchema },
		groupId: { type: String, ref: 'UserGroup' },
		isEmailVerified: { type: Boolean, default: false },
		status: {
			type: String,
			required: true,
			enum: STATUS_REGISTER_ARRAY,
			default: ACTIVE,
		},
		presenceStatus: {
			type: String,
			required: true,
			enum: PRESENCE_STATUS_ARRAY,
			default: 'offline',
		},
		lastSeenAt: { type: Date },
	},
	{ timestamps: true },
);

export default model<UserDocument>('User', userSchema);
