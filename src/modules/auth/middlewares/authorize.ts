import { asyncHandler } from '@Middlewares/asyncHandler';
import { hasPermission, Permission } from '@Constants/permissions';
import { AppError } from '@Shared/domain/AppError';

export const authorize = (...required: Permission[]) =>
	asyncHandler(async (_req, res, next) => {
		const userPermissions = (res.locals.permissions as string[]) ?? [];

		const allowed = required.some((perm) =>
			hasPermission(userPermissions, perm),
		);

		if (!allowed) {
			AppError.forbidden('FORBIDDEN', 'Insufficient permissions');
		}

		next();
	});
