import { asyncHandler } from '@Middlewares/asyncHandler';
import { hasPermission, PERMISSIONS } from '@Constants/permissions';
import type { Permission } from '@Constants/permissions';
import { AppError } from '@Shared/domain/AppError';

// The PATCH body can touch any mix of header/footer/layout/social/maps/
// contentLanguages in one request. Only when `contentLanguages` is the SOLE
// top-level key present does the narrow, delegatable SITE_CONFIG_LANGUAGES
// permission suffice — touching anything else (even together with
// contentLanguages in the same request) requires the general
// SITE_CONFIG_UPDATE permission, same as before this permission existed.
// Mirrors authorizeTranslationDomain's shape (required permission resolved
// from the request body rather than fixed at route-registration time).
export const authorizeSiteConfigUpdate = asyncHandler(
	async (req, res, next) => {
		const body = (req.body as Record<string, unknown> | undefined) ?? {};
		const keys = Object.keys(body);
		const onlyContentLanguages =
			keys.length > 0 && keys.every((key) => key === 'contentLanguages');

		const required: [Permission, Permission] = onlyContentLanguages
			? [PERMISSIONS.SITE_CONFIG_LANGUAGES, PERMISSIONS.SITE_CONFIG_MANAGE]
			: [PERMISSIONS.SITE_CONFIG_UPDATE, PERMISSIONS.SITE_CONFIG_MANAGE];

		const userPermissions = (res.locals.permissions as string[]) ?? [];
		const allowed = required.some((perm) => hasPermission(userPermissions, perm));

		if (!allowed) {
			AppError.forbidden('FORBIDDEN', 'Insufficient permissions');
		}

		next();
	},
);
