import { describe, it, expect } from 'vitest';
import { STORAGE_ERRORS } from '../errors/StorageErrors';

describe('STORAGE_ERRORS', () => {
	it('has all expected error codes as string values', () => {
		expect(STORAGE_ERRORS.FILE_REQUIRED).toBe('FILE_REQUIRED');
		expect(STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED).toBe('FILE_TYPE_NOT_ALLOWED');
		expect(STORAGE_ERRORS.MIME_TYPE_MISMATCH).toBe('MIME_TYPE_MISMATCH');
		expect(STORAGE_ERRORS.FILE_SIZE_EXCEEDED).toBe('FILE_SIZE_EXCEEDED');
		expect(STORAGE_ERRORS.TOO_MANY_FILES).toBe('TOO_MANY_FILES');
		expect(STORAGE_ERRORS.UPLOAD_FAILED).toBe('UPLOAD_FAILED');
		expect(STORAGE_ERRORS.DELETE_FAILED).toBe('DELETE_FAILED');
		expect(STORAGE_ERRORS.DRIVER_NOT_CONFIGURED).toBe('DRIVER_NOT_CONFIGURED');
	});
});
