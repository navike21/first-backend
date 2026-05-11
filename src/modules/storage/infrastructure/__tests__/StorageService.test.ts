import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { STORAGE_DRIVER: 'vercel-blob' },
}));

vi.mock('../drivers/VercelBlobDriver', () => ({
	VercelBlobDriver: class {
		uploadBuffer = vi.fn();
		delete = vi.fn();
	},
}));

import { getStorageDriver } from '../StorageService';

describe('getStorageDriver', () => {
	it('returns a driver with uploadBuffer and delete for vercel-blob', () => {
		const driver = getStorageDriver();
		expect(driver).toBeDefined();
		expect(typeof driver.uploadBuffer).toBe('function');
		expect(typeof driver.delete).toBe('function');
	});

	it('throws with DRIVER_NOT_CONFIGURED for an unknown driver', async () => {
		vi.doMock('@Constants/environments', () => ({
			ENV: { STORAGE_DRIVER: 'unknown-driver' },
		}));
		vi.resetModules();

		const { getStorageDriver: freshGet } = await import('../StorageService');

		expect(() => freshGet()).toThrow('Unknown storage driver');
	});
});
