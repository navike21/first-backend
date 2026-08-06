import generateUUID from '@Helpers/uuid';
import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';
import { CustomerModel } from '@Modules/customers';
import {
	CustomerInvalidTokenError,
	CustomerTokenReuseDetectedError,
} from '../domain/errors/CustomerAuthErrors';
import CustomerRefreshTokenModel from '../infrastructure/CustomerRefreshTokenModel';
import { CUSTOMER_REFRESH_EXPIRES_MS } from '../constants/customerAuthCookies';

export async function rotateCustomerRefreshToken(
	incomingToken: string,
	userAgent: string,
	ip: string,
) {
	let payload;
	try {
		payload = CustomerJwtService.verifyRefresh(incomingToken);
	} catch {
		throw new CustomerInvalidTokenError();
	}

	const storedToken = await CustomerRefreshTokenModel.findOne({
		jti: payload.jti,
	});
	if (!storedToken) throw new CustomerInvalidTokenError();

	if (storedToken.revokedAt) {
		await CustomerRefreshTokenModel.updateMany(
			{ customerId: storedToken.customerId },
			{ $set: { revokedAt: new Date() } },
		);
		throw new CustomerTokenReuseDetectedError();
	}

	const customer = await CustomerModel.findOne({
		id: payload.sub,
		deletedAt: null,
	});
	if (!customer) throw new CustomerInvalidTokenError();

	const newJti = generateUUID();
	const newAccessToken = CustomerJwtService.signAccess({
		sub: customer.id,
		firstName: customer.firstName,
		lastName: customer.lastName,
		email: customer.email,
	});
	const newRefreshToken = CustomerJwtService.signRefresh({
		sub: customer.id,
		jti: newJti,
	});

	const expiresAt = new Date(Date.now() + CUSTOMER_REFRESH_EXPIRES_MS);

	await Promise.all([
		CustomerRefreshTokenModel.findOneAndUpdate(
			{ jti: payload.jti },
			{ $set: { revokedAt: new Date(), replacedBy: newJti } },
		),
		CustomerRefreshTokenModel.create({
			jti: newJti,
			customerId: customer.id,
			userAgent,
			ip,
			expiresAt,
		}),
	]);

	return {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
		refreshExpiresMs: CUSTOMER_REFRESH_EXPIRES_MS,
	};
}
