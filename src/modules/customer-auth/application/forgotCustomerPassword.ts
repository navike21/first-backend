import { ENV } from '@Constants/environments';
import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { PasswordResetRequestedEvent } from '@Shared/events/emailEvents';
import { logInfo } from '@Helpers/log';
import { CustomerModel } from '@Modules/customers';

// The reset link points to a `customer-reset-password` path, deliberately
// distinct from staff's `/reset-password` — there is no public storefront
// page there yet (see the Ecommerce plan's Milestone A scope), but the link
// must never resolve to the staff reset page, which verifies against a
// different JWT secret and would reject a customer token as invalid.
export async function forgotCustomerPassword(email: string, lang = 'en') {
	const customer = await CustomerModel.findOne({
		email: email.toLowerCase(),
		deletedAt: null,
	});

	if (!customer) {
		logInfo(
			`[CustomerAuth] Forgot password requested for non-existent email: ${email}`,
		);
		return;
	}

	const token = CustomerJwtService.signEmail({
		sub: customer.id,
		type: 'password_reset',
	});
	const resetUrl = `${ENV.CLIENT_URL}/${lang}/customer-reset-password?token=${token}`;

	await eventBus.publish(
		new PasswordResetRequestedEvent(
			customer.email,
			customer.firstName,
			resetUrl,
			lang,
		),
	);
}
