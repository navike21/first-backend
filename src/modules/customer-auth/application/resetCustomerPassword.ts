import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';
import { CustomerModel } from '@Modules/customers';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import { CustomerInvalidTokenError } from '../domain/errors/CustomerAuthErrors';
import CustomerRefreshTokenModel from '../infrastructure/CustomerRefreshTokenModel';
import CustomerSessionModel from '../infrastructure/CustomerSessionModel';

export async function resetCustomerPassword(
	token: string,
	newPassword: string,
) {
	let payload;
	try {
		payload = CustomerJwtService.verifyEmail(token);
	} catch {
		throw new CustomerInvalidTokenError();
	}

	if (payload.type !== 'password_reset') throw new CustomerInvalidTokenError();

	const customer = await CustomerModel.findOne({
		id: payload.sub,
		deletedAt: null,
	});
	if (!customer) throw new CustomerInvalidTokenError();

	// Single-use: reject a token issued before the last password change, so a
	// reset link cannot be replayed after it has already been used.
	const issuedAtMs = (payload.iat ?? 0) * 1000;
	if (
		customer.passwordChangedAt &&
		issuedAtMs < customer.passwordChangedAt.getTime()
	) {
		throw new CustomerInvalidTokenError();
	}

	const newHash = await HashedPassword.hash(newPassword);

	await Promise.all([
		CustomerModel.findOneAndUpdate(
			{ id: payload.sub },
			{ $set: { passwordHash: newHash, passwordChangedAt: new Date() } },
		),
		CustomerRefreshTokenModel.updateMany(
			{ customerId: payload.sub, revokedAt: { $exists: false } },
			{ $set: { revokedAt: new Date() } },
		),
		CustomerSessionModel.deleteMany({ customerId: payload.sub }),
	]);
}
