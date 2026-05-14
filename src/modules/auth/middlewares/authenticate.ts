import { asyncHandler } from '@Middlewares/asyncHandler';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { AppError } from '@Shared/domain/AppError';

export const authenticate = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		AppError.unauthorized('UNAUTHORIZED', 'Authentication required');
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = JwtService.verifyAccess(token);
		res.locals.userId = payload.sub;
		res.locals.permissions = payload.permissions ?? [];
		next();
	} catch {
		AppError.unauthorized('INVALID_TOKEN', 'Invalid or expired token');
	}
});
