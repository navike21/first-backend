import { asyncHandler } from '@Middlewares/asyncHandler';
import { hasPermission, Permission } from '@Constants/permissions';
import setThrowError from '@Helpers/setThrowError';

export const authorize = (...required: Permission[]) =>
	asyncHandler(async (_req, res, next) => {
		const userPermissions = (res.locals.permissions as string[]) ?? [];

		const allowed = required.some((perm) =>
			hasPermission(userPermissions, perm),
		);

		if (!allowed) {
			setThrowError({
				statusCode: 403,
				code: 'FORBIDDEN',
				message: 'Insufficient permissions',
			});
		}

		next();
	});
