import { model, Schema } from 'mongoose';
import { USER_GENDER_ARRAY, UserGender } from '@Constants/userGender';
import { ACTIVE } from '@Constants/statusRegister';

export type UserStatus = 'active' | 'inactive';
import generateUUID from '@Helpers/uuid';

export interface AddressDocument {
	country?: string;
	ubigeoCode?: string;
	region?: string;
	province?: string;
	district?: string;
	address?: string;
	addressNumber?: string;
	addressInterior?: string;
}

export type PresenceStatus = 'available' | 'busy' | 'away' | 'offline';
export const PRESENCE_STATUS_ARRAY: PresenceStatus[] = [
	'available',
	'busy',
	'away',
	'offline',
];

export type ThemePreference = 'light' | 'dark' | 'system';
export const THEME_PREFERENCE_ARRAY: ThemePreference[] = [
	'light',
	'dark',
	'system',
];

/** Per-user UI preferences applied by the frontend after login. */
export interface UserPreferences {
	/** Preferred language (ISO code); falls back to app-settings.defaultLanguage. */
	language?: string;
	theme: ThemePreference;
}

export interface UserDocument {
	id: string;
	email: string;
	// Optional: a user may be created without a password (invite flow) and set
	// it later via forgot-password. Login rejects passwordless users.
	password?: string;
	passwordChangedAt?: Date;
	firstName: string;
	lastName: string;
	dateOfBirth?: Date;
	gender?: UserGender;
	phone?: string;
	profilePictureUrl?: string;
	address?: AddressDocument;
	preferences: UserPreferences;
	groupIds: string[];
	isEmailVerified: boolean;
	status: UserStatus;
	deletedAt?: Date | null;
	presenceStatus: PresenceStatus;
	lastSeenAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const addressSchema = new Schema<AddressDocument>(
	{
		country: { type: String, maxlength: 10, trim: true },
		ubigeoCode: { type: String, maxlength: 10, trim: true },
		region: { type: String, maxlength: 100, trim: true },
		province: { type: String, maxlength: 100, trim: true },
		district: { type: String, maxlength: 100, trim: true },
		address: { type: String, maxlength: 255, trim: true },
		addressNumber: { type: String, maxlength: 50, trim: true },
		addressInterior: { type: String, maxlength: 100, trim: true },
	},
	{ _id: false },
);

const preferencesSchema = new Schema<UserPreferences>(
	{
		language: { type: String, maxlength: 10 },
		theme: {
			type: String,
			enum: THEME_PREFERENCE_ARRAY,
			default: 'system',
		},
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
		password: { type: String },
		// Marks when the password last changed; reset tokens issued before this
		// are rejected (single-use). See auth/application/resetPassword.
		passwordChangedAt: { type: Date },
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
		preferences: { type: preferencesSchema, default: () => ({}) },
		groupIds: { type: [String], ref: 'UserGroup', default: [] },
		isEmailVerified: { type: Boolean, default: false },
		status: {
			type: String,
			required: true,
			enum: ['active', 'inactive'],
			default: ACTIVE,
		},
		deletedAt: { type: Date, default: null },
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
