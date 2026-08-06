import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';
import CustomerRefreshTokenModel from '../infrastructure/CustomerRefreshTokenModel';
import CustomerSessionModel from '../infrastructure/CustomerSessionModel';

export async function logoutCustomer(refreshToken: string) {
	let payload;
	try {
		payload = CustomerJwtService.verifyRefresh(refreshToken);
	} catch {
		return;
	}

	const stored = await CustomerRefreshTokenModel.findOne({ jti: payload.jti });

	if (stored && !stored.revokedAt) {
		await Promise.all([
			CustomerRefreshTokenModel.findOneAndUpdate(
				{ jti: payload.jti },
				{ $set: { revokedAt: new Date() } },
			),
			CustomerSessionModel.deleteOne({ customerId: payload.sub }),
		]);
	}
}
