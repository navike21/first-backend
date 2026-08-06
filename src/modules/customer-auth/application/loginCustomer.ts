import generateUUID from '@Helpers/uuid';
import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';
import { CustomerModel } from '@Modules/customers';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import { InvalidCustomerCredentialsError } from '../domain/errors/CustomerAuthErrors';
import CustomerRefreshTokenModel from '../infrastructure/CustomerRefreshTokenModel';
import CustomerSessionModel from '../infrastructure/CustomerSessionModel';
import { CUSTOMER_REFRESH_EXPIRES_MS } from '../constants/customerAuthCookies';

interface LoginInput {
	email: string;
	password: string;
	userAgent: string;
	ip: string;
}

export async function loginCustomer({
	email,
	password,
	userAgent,
	ip,
}: LoginInput) {
	const customer = await CustomerModel.findOne({
		email: email.toLowerCase(),
		deletedAt: null,
	}).select('+passwordHash');
	if (!customer) throw new InvalidCustomerCredentialsError();
	if (!customer.passwordHash) throw new InvalidCustomerCredentialsError();

	const isValid = await HashedPassword.compare(password, customer.passwordHash);
	if (!isValid) throw new InvalidCustomerCredentialsError();

	const jti = generateUUID();
	const accessToken = CustomerJwtService.signAccess({
		sub: customer.id,
		firstName: customer.firstName,
		lastName: customer.lastName,
		email: customer.email,
	});
	const refreshToken = CustomerJwtService.signRefresh({
		sub: customer.id,
		jti,
	});

	const expiresAt = new Date(Date.now() + CUSTOMER_REFRESH_EXPIRES_MS);

	await Promise.all([
		CustomerRefreshTokenModel.create({
			jti,
			customerId: customer.id,
			userAgent,
			ip,
			expiresAt,
		}),
		CustomerSessionModel.create({ customerId: customer.id, userAgent, ip }),
	]);

	return {
		accessToken,
		refreshToken,
		refreshExpiresMs: CUSTOMER_REFRESH_EXPIRES_MS,
		customer: {
			id: customer.id,
			email: customer.email,
			firstName: customer.firstName,
			lastName: customer.lastName,
		},
	};
}
