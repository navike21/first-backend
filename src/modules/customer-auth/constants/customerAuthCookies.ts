import { ENV } from '@Constants/environments';

// Distinct cookie name AND path from staff auth's `refreshToken` — belt and
// suspenders on top of the separate JWT secrets, so the two refresh cookies
// can never be confused by the browser or a caller.
export const CUSTOMER_REFRESH_COOKIE = 'customerRefreshToken';
export const CUSTOMER_AUTH_COOKIE_PATH = '/api/v1/customer-auth';

function msFromJwtExpiry(duration: string): number {
	const m = /^(\d+)([smhdw])$/.exec(duration);
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

export const CUSTOMER_REFRESH_EXPIRES_MS = msFromJwtExpiry(
	ENV.JWT_CUSTOMER_REFRESH_EXPIRES,
);
