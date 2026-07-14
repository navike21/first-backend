import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockFields, multerFn } = vi.hoisted(() => {
	class FakeMulterError extends Error {
		constructor(public code: string) {
			super(code);
			this.name = 'MulterError';
		}
	}

	const mockFields = vi.fn();
	const mockMemoryStorage = vi.fn(() => ({}));
	const multerInstance = { fields: mockFields };
	const multerFn = Object.assign(
		vi.fn(() => multerInstance),
		{
			memoryStorage: mockMemoryStorage,
			MulterError: FakeMulterError,
		},
	);

	return { mockFields, multerFn };
});

vi.mock('multer', () => ({ default: multerFn }));
vi.mock('@Constants/environments', () => ({
	ENV: { STORAGE_MAX_IMAGE_SIZE_BYTES: 4 * 1024 * 1024 },
}));
vi.mock('@Modules/storage/middlewares/validateFileType', () => ({
	validateSingleFile: vi.fn().mockResolvedValue(undefined),
}));

import { acceptImageFields } from '@Modules/storage/middlewares/acceptImageFields';
import { validateSingleFile } from '@Modules/storage/middlewares/validateFileType';

function makeInner(cb: (next: (err?: unknown) => void) => void) {
	return vi.fn(
		(_req: Request, _res: Response, next: (err?: unknown) => void) => {
			cb(next);
		},
	);
}

function run(
	handler: (req: Request, res: Response, next: NextFunction) => void,
	req: Partial<Request> = {},
): Promise<void> {
	return new Promise((resolve, reject) => {
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		handler(req as Request, {} as Response, next);
	});
}

describe('acceptImageFields', () => {
	beforeEach(() => vi.clearAllMocks());

	it('defaults string entries to maxCount 1 and sums the per-field limit', async () => {
		mockFields.mockReturnValue(makeInner((next) => next()));
		const [parse] = acceptImageFields(['logo', 'favicon']);
		await run(parse as never);

		expect(mockFields).toHaveBeenCalledWith([
			{ name: 'logo', maxCount: 1 },
			{ name: 'favicon', maxCount: 1 },
		]);
	});

	it('honours a per-field maxCount for object entries (e.g. a gallery field)', async () => {
		mockFields.mockReturnValue(makeInner((next) => next()));
		const [parse] = acceptImageFields([
			{ name: 'cover' },
			{ name: 'gallery', maxCount: 10 },
		]);
		await run(parse as never);

		expect(mockFields).toHaveBeenCalledWith([
			{ name: 'cover', maxCount: 1 },
			{ name: 'gallery', maxCount: 10 },
		]);
		expect(multerFn).toHaveBeenCalledWith(
			expect.objectContaining({
				limits: expect.objectContaining({ files: 11 }),
			}),
		);
	});

	it('validates every file across every field, including multi-file fields', async () => {
		mockFields.mockReturnValue(makeInner((next) => next()));
		const [, validate] = acceptImageFields([{ name: 'gallery', maxCount: 10 }]);

		const req = {
			files: {
				cover: [{ mimetype: 'image/png' }],
				gallery: [{ mimetype: 'image/png' }, { mimetype: 'image/jpeg' }],
			},
		};
		await run(validate as never, req);

		expect(validateSingleFile).toHaveBeenCalledTimes(3);
	});
});
