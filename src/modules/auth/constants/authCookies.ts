import { ENV } from '@Constants/environments';

export const REFRESH_COOKIE = 'refreshToken';
export const AUTH_COOKIE_PATH = '/api/v1/auth';

function msFromJwtExpiry(duration: string): number {
	const m = /^(\d+)(s|m|h|d|w)$/.exec(duration);
	if (!m) return 30 * 24 * 60 * 60 * 1000; // 30d fallback
	const v = parseInt(m[1], 10);
	const units: Record<string, number> = {
		s: 1_000,
		m: 60_000,
		h: 3_600_000,
		d: 86_400_000,
		w: 604_800_000,
	};
	return v * (units[m[2]] ?? 86_400_000);
}

export const REFRESH_EXPIRES_MS = msFromJwtExpiry(ENV.JWT_REFRESH_EXPIRES);
