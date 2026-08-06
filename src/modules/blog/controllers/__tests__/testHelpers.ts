import { vi } from 'vitest';
import type { Response } from 'express';

export function makeRes(): Response {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}
