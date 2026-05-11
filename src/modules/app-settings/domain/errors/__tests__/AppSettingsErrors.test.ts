import { describe, it, expect } from 'vitest';
import { APP_SETTINGS_ERRORS } from '../AppSettingsErrors';

describe('APP_SETTINGS_ERRORS', () => {
	it('has NOT_FOUND as a string value', () => {
		expect(APP_SETTINGS_ERRORS.NOT_FOUND).toBe('APP_SETTINGS_NOT_FOUND');
	});

	it('has EMPTY_UPDATE as a string value', () => {
		expect(APP_SETTINGS_ERRORS.EMPTY_UPDATE).toBe('APP_SETTINGS_EMPTY_UPDATE');
	});
});
