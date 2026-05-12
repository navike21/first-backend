import { Schema, model } from 'mongoose';
import type { AppSettingsData } from '../constants/settingsDefaults';

export interface AppSettingsDocument extends AppSettingsData {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

const appSettingsSchema = new Schema<AppSettingsDocument>(
	{
		id: { type: String, required: true, unique: true, default: 'singleton' },
		general: {
			appName: { type: String, default: 'My Application' },
			defaultLanguage: { type: String, default: 'en' },
			timezone: { type: String, default: 'UTC' },
			maintenanceMode: { type: Boolean, default: false },
		},
		notifications: {
			emailSenderName: { type: String, default: 'No Reply' },
			emailSenderAddress: { type: String, default: 'noreply@example.com' },
			welcomeEmailEnabled: { type: Boolean, default: true },
			notificationsEnabled: { type: Boolean, default: true },
		},
		appearance: {
			logoUrl: { type: String, default: null },
			primaryColor: { type: String, default: null },
			faviconUrl: { type: String, default: null },
		},
	},
	{ timestamps: true },
);

export default model<AppSettingsDocument>('AppSettings', appSettingsSchema);
