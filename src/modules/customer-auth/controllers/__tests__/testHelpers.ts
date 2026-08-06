import { vi } from 'vitest';
import type { Response } from 'express';

export function makeRes(locals: Record<string, unknown> = {}) {
	return {
		locals,
		cookie: vi.fn(),
		clearCookie: vi.fn(),
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}
