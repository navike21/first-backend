import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { AppError } from '@Shared/domain/AppError';
import {
	parseRequestData,
	getUploadedFile,
} from '@Helpers/multipartRequest';

describe('parseRequestData', () => {
	it('returns the JSON body as-is when there is no "data" field', () => {
		const req = { body: { a: 1 } } as unknown as Request;
		expect(parseRequestData(req)).toEqual({ a: 1 });
	});

	it('parses the "data" field when it is a JSON string (multipart case)', () => {
		const req = {
			body: { data: '{"businessName":"Acme"}' },
		} as unknown as Request;
		expect(parseRequestData(req)).toEqual({ businessName: 'Acme' });
	});

	it('throws ERROR_INVALID_BODY when "data" is not valid JSON', () => {
		const req = { body: { data: '{not json' } } as unknown as Request;
		try {
			parseRequestData(req);
			throw new Error('should have thrown');
		} catch (err) {
			expect(err).toBeInstanceOf(AppError);
			expect((err as AppError).code).toBe('ERROR_INVALID_BODY');
		}
	});
});

describe('getUploadedFile', () => {
	it('returns undefined when no file is present', () => {
		const req = {} as unknown as Request;
		expect(getUploadedFile(req)).toBeUndefined();
	});

	it('maps multer file fields into an IncomingFile', () => {
		const req = {
			file: {
				buffer: Buffer.from('x'),
				originalname: 'logo.png',
				mimetype: 'image/png',
			},
		} as unknown as Request;

		expect(getUploadedFile(req)).toEqual({
			buffer: Buffer.from('x'),
			originalName: 'logo.png',
			mimeType: 'image/png',
		});
	});
});
