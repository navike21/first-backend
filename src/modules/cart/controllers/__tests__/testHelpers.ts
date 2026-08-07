import { vi } from 'vitest';
import type { Response } from 'express';

export function makeRes(locals: Record<string, unknown> = {}) {
	return {
		locals,
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}
