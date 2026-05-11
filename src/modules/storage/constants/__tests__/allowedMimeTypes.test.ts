import { describe, it, expect } from 'vitest';
import {
	RASTER_IMAGE_MIME_TYPES,
	VECTOR_IMAGE_MIME_TYPES,
	IMAGE_MIME_TYPES,
	DOCUMENT_MIME_TYPES,
	ALL_ALLOWED_MIME_TYPES,
	isRasterImage,
	isSvg,
	isImageMimeType,
} from '../allowedMimeTypes';

describe('MIME type constants', () => {
	it('RASTER_IMAGE_MIME_TYPES contains jpeg, png, webp', () => {
		expect(RASTER_IMAGE_MIME_TYPES).toContain('image/jpeg');
		expect(RASTER_IMAGE_MIME_TYPES).toContain('image/png');
		expect(RASTER_IMAGE_MIME_TYPES).toContain('image/webp');
	});

	it('VECTOR_IMAGE_MIME_TYPES contains svg', () => {
		expect(VECTOR_IMAGE_MIME_TYPES).toContain('image/svg+xml');
	});

	it('IMAGE_MIME_TYPES combines raster and vector', () => {
		expect(IMAGE_MIME_TYPES).toContain('image/jpeg');
		expect(IMAGE_MIME_TYPES).toContain('image/svg+xml');
	});

	it('DOCUMENT_MIME_TYPES contains pdf and office formats', () => {
		expect(DOCUMENT_MIME_TYPES).toContain('application/pdf');
		expect(DOCUMENT_MIME_TYPES).toContain('application/msword');
	});

	it('ALL_ALLOWED_MIME_TYPES combines images and documents', () => {
		expect(ALL_ALLOWED_MIME_TYPES.length).toBeGreaterThan(0);
		expect(ALL_ALLOWED_MIME_TYPES).toContain('image/jpeg');
		expect(ALL_ALLOWED_MIME_TYPES).toContain('application/pdf');
	});
});

describe('isRasterImage', () => {
	it('returns true for raster MIME types', () => {
		expect(isRasterImage('image/jpeg')).toBe(true);
		expect(isRasterImage('image/png')).toBe(true);
		expect(isRasterImage('image/webp')).toBe(true);
	});

	it('returns false for non-raster types', () => {
		expect(isRasterImage('image/svg+xml')).toBe(false);
		expect(isRasterImage('application/pdf')).toBe(false);
		expect(isRasterImage('image/gif')).toBe(false);
	});
});

describe('isSvg', () => {
	it('returns true for SVG MIME type', () => {
		expect(isSvg('image/svg+xml')).toBe(true);
	});

	it('returns false for non-SVG types', () => {
		expect(isSvg('image/jpeg')).toBe(false);
		expect(isSvg('application/pdf')).toBe(false);
	});
});

describe('isImageMimeType', () => {
	it('returns true for any image type', () => {
		expect(isImageMimeType('image/jpeg')).toBe(true);
		expect(isImageMimeType('image/svg+xml')).toBe(true);
		expect(isImageMimeType('image/webp')).toBe(true);
	});

	it('returns false for documents', () => {
		expect(isImageMimeType('application/pdf')).toBe(false);
	});
});
