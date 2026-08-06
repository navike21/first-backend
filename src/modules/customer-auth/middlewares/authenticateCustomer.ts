import { asyncHandler } from '@Middlewares/asyncHandler';
import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';
import { AppError } from '@Shared/domain/AppError';

// Parallel to staff `authenticate` — deliberately never shared. Sets
// `res.locals.customerId` only (no `permissions`: customers have no RBAC
// concept, they can only ever touch their own resources via `customerId`).
export const authenticateCustomer = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		AppError.unauthorized('UNAUTHORIZED', 'Authentication required');
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = CustomerJwtService.verifyAccess(token);
		res.locals.customerId = payload.sub;
		res.locals.customer = {
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email,
		};
		next();
	} catch {
		AppError.unauthorized('INVALID_TOKEN', 'Invalid or expired token');
	}
});
