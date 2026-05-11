import { asyncHandler } from '@Middlewares/asyncHandler';
import { JwtService } from '@Shared/infrastructure/JwtService';
import setThrowError from '@Helpers/setThrowError';

export const authenticate = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		setThrowError({
			statusCode: 401,
			code: 'UNAUTHORIZED',
			message: 'Authentication required',
		});
	}

	const token = authHeader!.split(' ')[1];

	try {
		const payload = JwtService.verifyAccess(token);
		res.locals.userId = payload.sub;
		res.locals.permissions = payload.permissions ?? [];
		next();
	} catch {
		setThrowError({
			statusCode: 401,
			code: 'INVALID_TOKEN',
			message: 'Invalid or expired token',
		});
	}
});
