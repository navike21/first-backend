export const APP_SETTINGS_ERRORS = {
	NOT_FOUND: 'APP_SETTINGS_NOT_FOUND',
	EMPTY_UPDATE: 'APP_SETTINGS_EMPTY_UPDATE',
} as const;

export type AppSettingsErrorCode =
	(typeof APP_SETTINGS_ERRORS)[keyof typeof APP_SETTINGS_ERRORS];
