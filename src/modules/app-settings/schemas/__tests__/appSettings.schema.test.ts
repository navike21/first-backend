import { describe, it, expect } from 'vitest';
import { AppSettingsUpdateSchema } from '../appSettings.schema';

describe('AppSettingsUpdateSchema', () => {
	it('fails when all categories are absent (refine)', () => {
		const result = AppSettingsUpdateSchema.safeParse({});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('APP_SETTINGS_EMPTY_UPDATE');
		}
	});

	it('succeeds with only general provided', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			general: { appName: 'Test' },
		});
		expect(result.success).toBe(true);
	});

	it('succeeds with only notifications provided', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			notifications: { emailSenderName: 'Bot' },
		});
		expect(result.success).toBe(true);
	});

	it('succeeds with only appearance provided', () => {
		const result = AppSettingsUpdateSchema.safeParse({ appearance: {} });
		expect(result.success).toBe(true);
	});

	it('fails when emailSenderAddress is invalid', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			notifications: { emailSenderAddress: 'not-an-email' },
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('APP_SETTINGS_EMAIL_INVALID');
		}
	});

	it('accepts a valid emailSenderAddress', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			notifications: { emailSenderAddress: 'sender@example.com' },
		});
		expect(result.success).toBe(true);
	});

	it('fails when primaryColor is not a valid hex color', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { primaryColor: 'blue' },
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('APP_SETTINGS_COLOR_INVALID');
		}
	});

	it('accepts a valid hex primaryColor', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { primaryColor: '#1A2B3C' },
		});
		expect(result.success).toBe(true);
	});

	it('fails when logoUrl is not a valid URL', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { logoUrl: 'not-a-url' },
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('APP_SETTINGS_URL_INVALID');
		}
	});

	it('accepts a valid logoUrl', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { logoUrl: 'https://example.com/logo.png' },
		});
		expect(result.success).toBe(true);
	});

	it('accepts null for nullish appearance fields (to allow clearing)', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { logoUrl: null, primaryColor: null, faviconUrl: null },
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.appearance?.logoUrl).toBeNull();
		}
	});

	it('accepts a valid faviconUrl', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { faviconUrl: 'https://example.com/favicon.ico' },
		});
		expect(result.success).toBe(true);
	});

	it('fails when faviconUrl is invalid', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			appearance: { faviconUrl: 'bad-url' },
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('APP_SETTINGS_URL_INVALID');
		}
	});

	it('accepts all three categories at once', () => {
		const result = AppSettingsUpdateSchema.safeParse({
			general: { appName: 'App', maintenanceMode: true },
			notifications: { notificationsEnabled: false },
			appearance: { primaryColor: '#FF0000' },
		});
		expect(result.success).toBe(true);
	});
});
