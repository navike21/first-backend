import { describe, it, expect } from 'vitest';
import { StorageUploadBodySchema, StorageDeleteSchema } from '../storage.schema';

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

describe('StorageUploadBodySchema', () => {
	it('parses valid input', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 'users',
			entityId: VALID_UUID,
			quality: 80,
		});
		expect(result.success).toBe(true);
	});

	it('defaults quality to 80 when omitted', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 'users',
			entityId: VALID_UUID,
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.quality).toBe(80);
	});

	it('fails with STORAGE_ENTITY_TYPE_REQUIRED when entityType is missing', () => {
		const result = StorageUploadBodySchema.safeParse({ entityId: VALID_UUID });
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_ENTITY_TYPE_REQUIRED');
		}
	});

	it('fails with STORAGE_ENTITY_TYPE_INVALID when entityType is wrong type', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 123,
			entityId: VALID_UUID,
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_ENTITY_TYPE_INVALID');
		}
	});

	it('fails with STORAGE_ENTITY_ID_INVALID when entityId is not a UUID', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 'users',
			entityId: 'not-a-uuid',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_ENTITY_ID_INVALID');
		}
	});

	it('fails when entityType contains invalid characters', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 'Users_Data',
			entityId: VALID_UUID,
		});
		expect(result.success).toBe(false);
	});

	it('fails when quality is below 70', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 'users',
			entityId: VALID_UUID,
			quality: 50,
		});
		expect(result.success).toBe(false);
	});

	it('fails when quality exceeds 100', () => {
		const result = StorageUploadBodySchema.safeParse({
			entityType: 'users',
			entityId: VALID_UUID,
			quality: 110,
		});
		expect(result.success).toBe(false);
	});
});

describe('StorageDeleteSchema', () => {
	it('parses valid input with one URL', () => {
		const result = StorageDeleteSchema.safeParse({
			urls: ['https://cdn.example.com/file.jpg'],
		});
		expect(result.success).toBe(true);
	});

	it('fails with STORAGE_URLS_REQUIRED when urls is missing', () => {
		const result = StorageDeleteSchema.safeParse({});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_URLS_REQUIRED');
		}
	});

	it('fails with STORAGE_URLS_INVALID when urls is not an array', () => {
		const result = StorageDeleteSchema.safeParse({ urls: 'not-array' });
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_URLS_INVALID');
		}
	});

	it('fails with STORAGE_URLS_MIN when urls array is empty', () => {
		const result = StorageDeleteSchema.safeParse({ urls: [] });
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_URLS_MIN');
		}
	});

	it('fails when a URL in the array is invalid', () => {
		const result = StorageDeleteSchema.safeParse({
			urls: ['not-a-url'],
		});
		expect(result.success).toBe(false);
	});
});
