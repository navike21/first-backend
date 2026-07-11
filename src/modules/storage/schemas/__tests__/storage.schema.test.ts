import { describe, it, expect } from 'vitest';
import {
	StorageUploadBodySchema,
	StorageDeleteSchema,
	StorageListQuerySchema,
} from '../storage.schema';

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
	it('parses valid input with one UUID id', () => {
		const result = StorageDeleteSchema.safeParse({
			ids: [VALID_UUID],
		});
		expect(result.success).toBe(true);
	});

	it('parses valid input with multiple UUID ids', () => {
		const result = StorageDeleteSchema.safeParse({
			ids: [VALID_UUID, 'a47ac10b-58cc-4372-a567-0e02b2c3d479'],
		});
		expect(result.success).toBe(true);
	});

	it('fails with STORAGE_IDS_REQUIRED when ids is missing', () => {
		const result = StorageDeleteSchema.safeParse({});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_IDS_REQUIRED');
		}
	});

	it('fails with STORAGE_IDS_INVALID when ids is not an array', () => {
		const result = StorageDeleteSchema.safeParse({ ids: 'not-array' });
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_IDS_INVALID');
		}
	});

	it('fails with STORAGE_IDS_MIN when ids array is empty', () => {
		const result = StorageDeleteSchema.safeParse({ ids: [] });
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('STORAGE_IDS_MIN');
		}
	});

	it('fails when an id in the array is not a valid UUID', () => {
		const result = StorageDeleteSchema.safeParse({
			ids: ['not-a-uuid'],
		});
		expect(result.success).toBe(false);
	});
});

describe('StorageListQuerySchema', () => {
	it('defaults page and limit, leaves kind/search undefined', () => {
		const result = StorageListQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(20);
			expect(result.data.kind).toBeUndefined();
			expect(result.data.search).toBeUndefined();
		}
	});

	it('accepts kind=image and kind=video', () => {
		expect(StorageListQuerySchema.safeParse({ kind: 'image' }).success).toBe(true);
		expect(StorageListQuerySchema.safeParse({ kind: 'video' }).success).toBe(true);
	});

	it('rejects an unknown kind', () => {
		expect(StorageListQuerySchema.safeParse({ kind: 'document' }).success).toBe(false);
	});

	it('trims search and rejects an overly long one', () => {
		const trimmed = StorageListQuerySchema.safeParse({ search: '  logo  ' });
		expect(trimmed.success).toBe(true);
		if (trimmed.success) expect(trimmed.data.search).toBe('logo');

		const tooLong = StorageListQuerySchema.safeParse({ search: 'a'.repeat(201) });
		expect(tooLong.success).toBe(false);
	});
});
