import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processRasterImage } from '../ImageProcessor';

const mockToBuffer = vi.fn();
const mockWebp = vi.fn();
const mockResize = vi.fn();

vi.mock('sharp', () => ({
	default: vi.fn(() => ({
		resize: mockResize,
		webp: mockWebp,
		toBuffer: mockToBuffer,
	})),
}));

describe('processRasterImage', () => {
	const fakeBuffer = Buffer.from('fake-image-data');
	const processedBuffer = Buffer.from('processed');

	beforeEach(() => {
		mockResize.mockReturnValue({ webp: mockWebp });
		mockWebp.mockReturnValue({ toBuffer: mockToBuffer });
		mockToBuffer.mockResolvedValue(processedBuffer);
	});

	it('returns full and thumb buffers', async () => {
		const result = await processRasterImage(fakeBuffer, 80);

		expect(result.full).toBeInstanceOf(Buffer);
		expect(result.thumb).toBeInstanceOf(Buffer);
	});

	it('generates full variant with inside fit and max 2000px', async () => {
		await processRasterImage(fakeBuffer, 80);

		expect(mockResize).toHaveBeenCalledWith(2000, 2000, {
			fit: 'inside',
			withoutEnlargement: true,
		});
	});

	it('generates thumb variant with cover fit and 700px', async () => {
		await processRasterImage(fakeBuffer, 80);

		expect(mockResize).toHaveBeenCalledWith(700, 700, {
			fit: 'cover',
			position: 'centre',
		});
	});

	it('applies the provided quality to both variants', async () => {
		await processRasterImage(fakeBuffer, 90);

		expect(mockWebp).toHaveBeenCalledWith({ quality: 90 });
	});
});
