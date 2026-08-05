import { asyncHandler } from '@Middlewares/asyncHandler';
import { hasPermission, PERMISSIONS } from '@Constants/permissions';
import type { Permission } from '@Constants/permissions';
import { AppError } from '@Shared/domain/AppError';
import type { TranslationDomain } from '../schemas/suggestTranslation.schema';

// A single route now serves every CMS domain this module supports, each
// with its own update/manage permission pair — so, unlike a normal route,
// the required permission can't be fixed at router-registration time; it
// depends on `req.body.domain`. Mirrors `authorize`'s own allow logic
// (`hasPermission`) rather than duplicating it.
const DOMAIN_PERMISSIONS: Record<TranslationDomain, [Permission, Permission]> =
	{
		services: [PERMISSIONS.SERVICES_UPDATE, PERMISSIONS.SERVICES_MANAGE],
		pages: [PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE],
		portfolio: [PERMISSIONS.PORTFOLIO_UPDATE, PERMISSIONS.PORTFOLIO_MANAGE],
		collaborators: [
			PERMISSIONS.COLLABORATORS_UPDATE,
			PERMISSIONS.COLLABORATORS_MANAGE,
		],
		forms: [PERMISSIONS.FORMS_UPDATE, PERMISSIONS.FORMS_MANAGE],
		categories: [PERMISSIONS.CATEGORIES_UPDATE, PERMISSIONS.CATEGORIES_MANAGE],
		tags: [PERMISSIONS.TAGS_UPDATE, PERMISSIONS.TAGS_MANAGE],
		// Page content lives under the Pages resource — same permission pair as
		// the `pages` domain (metadata), not a new resource of its own.
		'page-builder': [PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE],
	};

export const authorizeTranslationDomain = asyncHandler(
	async (req, res, next) => {
		const domain = (req.body as { domain?: string } | undefined)?.domain;
		const required = (DOMAIN_PERMISSIONS as Record<string, Permission[]>)[
			domain ?? ''
		];
		const userPermissions = (res.locals.permissions as string[]) ?? [];

		const allowed =
			!!required && required.some((perm) => hasPermission(userPermissions, perm));

		if (!allowed) {
			AppError.forbidden('FORBIDDEN', 'Insufficient permissions');
		}

		next();
	},
);
