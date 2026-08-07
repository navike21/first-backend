import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createPaymentMethod } from '@Modules/payments/application/createPaymentMethod';
import { getPaymentMethodById } from '@Modules/payments/application/getPaymentMethodById';
import { listPaymentMethods } from '@Modules/payments/application/listPaymentMethods';
import { listDeletedPaymentMethods } from '@Modules/payments/application/listDeletedPaymentMethods';
import { deletePaymentMethodLogical } from '@Modules/payments/application/deletePaymentMethodLogical';
import { deletePaymentMethodPhysical } from '@Modules/payments/application/deletePaymentMethodPhysical';
import { restorePaymentMethod } from '@Modules/payments/application/restorePaymentMethod';
import { deletePaymentMethodsBulk } from '@Modules/payments/application/deletePaymentMethodsBulk';
import { restorePaymentMethodsBulk } from '@Modules/payments/application/restorePaymentMethodsBulk';
import { purgePaymentMethodsBulk } from '@Modules/payments/application/purgePaymentMethodsBulk';
import { PaymentMethodNotFoundError } from '@Modules/payments/domain/errors/PaymentErrors';

withMongo();

const customerA = '11111111-1111-4111-8111-111111111111';
const customerB = '22222222-2222-4222-8222-222222222222';

function payload(customerId: string, overrides: Record<string, unknown> = {}) {
	return {
		customerId,
		provider: 'stripe' as const,
		providerToken: 'tok_visa',
		brand: 'Visa',
		last4: '4242',
		expiryMonth: 12,
		expiryYear: 2030,
		isDefault: false,
		...overrides,
	};
}

describe('payment method lifecycle', () => {
	it('getPaymentMethodById returns the method, and 404s once soft-deleted', async () => {
		const created = await createPaymentMethod(payload(customerA));
		await expect(getPaymentMethodById(created.id)).resolves.toMatchObject({
			id: created.id,
		});

		await deletePaymentMethodLogical(created.id);
		await expect(getPaymentMethodById(created.id)).rejects.toBeInstanceOf(
			PaymentMethodNotFoundError,
		);
	});

	it('listPaymentMethods filters by customerId and provider', async () => {
		await createPaymentMethod(payload(customerA));
		await createPaymentMethod(payload(customerB, { provider: 'culqi' }));

		const forA = await listPaymentMethods({ page: 1, limit: 10, customerId: customerA });
		expect(forA.data.every((m) => m.customerId === customerA)).toBe(true);

		const culqiOnly = await listPaymentMethods({ page: 1, limit: 10, provider: 'culqi' });
		expect(culqiOnly.data.every((m) => m.provider === 'culqi')).toBe(true);
	});

	it('soft-delete then restore round-trips through the trash listing', async () => {
		const created = await createPaymentMethod(payload(customerA));
		await deletePaymentMethodLogical(created.id);

		const trash = await listDeletedPaymentMethods({ page: 1, limit: 10 });
		expect(trash.data.map((m) => m.id)).toContain(created.id);

		await restorePaymentMethod(created.id);
		const active = await listPaymentMethods({ page: 1, limit: 10 });
		expect(active.data.map((m) => m.id)).toContain(created.id);
	});

	it('deletePaymentMethodPhysical removes a trashed method permanently', async () => {
		const created = await createPaymentMethod(payload(customerA));
		await deletePaymentMethodLogical(created.id);

		await deletePaymentMethodPhysical(created.id);
		await expect(getPaymentMethodById(created.id)).rejects.toBeInstanceOf(
			PaymentMethodNotFoundError,
		);
	});

	it('bulk soft-delete, restore, and purge report processed/notFound ids', async () => {
		const a = await createPaymentMethod(payload(customerA));
		const b = await createPaymentMethod(payload(customerB));
		const missingId = crypto.randomUUID();

		const expectedIds = new Set([a.id, b.id]);

		const deleted = await deletePaymentMethodsBulk([a.id, b.id, missingId]);
		expect(new Set(deleted.processedIds)).toEqual(expectedIds);
		expect(deleted.notFoundIds).toEqual([missingId]);

		const restored = await restorePaymentMethodsBulk([a.id, b.id]);
		expect(new Set(restored.processedIds)).toEqual(expectedIds);

		await deletePaymentMethodsBulk([a.id, b.id]);
		const purged = await purgePaymentMethodsBulk([a.id, b.id]);
		expect(new Set(purged.processedIds)).toEqual(expectedIds);

		await expect(getPaymentMethodById(a.id)).rejects.toBeInstanceOf(
			PaymentMethodNotFoundError,
		);
	});
});
