export interface GeneralSettings {
	appName: string;
	defaultLanguage: string;
	timezone: string;
	maintenanceMode: boolean;
}

export interface NotificationSettings {
	emailSenderName: string;
	emailSenderAddress: string;
	welcomeEmailEnabled: boolean;
	notificationsEnabled: boolean;
}

export interface AppearanceSettings {
	logoUrl?: string | null;
	primaryColor?: string | null;
	faviconUrl?: string | null;
}

export interface AppSettingsData {
	general: GeneralSettings;
	notifications: NotificationSettings;
	appearance: AppearanceSettings;
}

export const APP_SETTINGS_DEFAULTS: AppSettingsData = {
	general: {
		appName: 'My Application',
		defaultLanguage: 'en',
		timezone: 'UTC',
		maintenanceMode: false,
	},
	notifications: {
		emailSenderName: 'No Reply',
		emailSenderAddress: 'noreply@example.com',
		welcomeEmailEnabled: true,
		notificationsEnabled: true,
	},
	appearance: {},
};
