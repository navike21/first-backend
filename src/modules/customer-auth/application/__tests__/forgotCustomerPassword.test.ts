import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { CustomerModel } from '@Modules/customers';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { forgotCustomerPassword } from '@Modules/customer-auth/application/forgotCustomerPassword';

withMongo();

vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: { signEmail: vi.fn().mockReturnValue('RESET_TOKEN') },
}));

vi.mock('@Constants/environments', () => ({
	ENV: { CLIENT_URL: 'http://localhost:3000' },
}));

vi.mock('@Helpers/log', () => ({ logInfo: vi.fn() }));

describe('forgotCustomerPassword', () => {
	let publishSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue();
	});
	afterEach(() => {
		publishSpy.mockRestore();
	});

	it('publishes PasswordResetRequestedEvent for an existing customer', async () => {
		const customer = await CustomerModel.create({
			firstName: 'Jane',
			lastName: 'Doe',
			email: `c-${crypto.randomUUID().slice(0, 8)}@test.com`,
			passwordHash: 'hashed',
		});

		await forgotCustomerPassword(customer.email);

		expect(publishSpy).toHaveBeenCalledTimes(1);
		const event = publishSpy.mock.calls[0][0];
		expect(event.eventName).toBe('auth.password_reset_requested');
		expect(event).toMatchObject({ email: customer.email });
	});

	it('resolves silently without publishing for a non-existent customer', async () => {
		await expect(
			forgotCustomerPassword('nobody@example.com'),
		).resolves.toBeUndefined();
		expect(publishSpy).not.toHaveBeenCalled();
	});

	it('embeds the customer-specific reset path and requested language in the URL', async () => {
		const customer = await CustomerModel.create({
			firstName: 'Jane',
			lastName: 'Doe',
			email: `c-${crypto.randomUUID().slice(0, 8)}@test.com`,
			passwordHash: 'hashed',
		});

		await forgotCustomerPassword(customer.email, 'fr');

		const event = publishSpy.mock.calls[0][0];
		expect(event.resetUrl).toBe(
			'http://localhost:3000/fr/customer-reset-password?token=RESET_TOKEN',
		);
	});
});
