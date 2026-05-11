import { describe, it, expect } from 'vitest';
import AppSettingsModel from '../AppSettingsModel';

describe('AppSettingsModel', () => {
	it('exports a Mongoose model', () => {
		expect(AppSettingsModel).toBeDefined();
		expect(typeof AppSettingsModel.findOne).toBe('function');
		expect(typeof AppSettingsModel.findOneAndUpdate).toBe('function');
		expect(typeof AppSettingsModel.create).toBe('function');
	});
});
