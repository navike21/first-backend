import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createShippingRule } from '@Modules/shipping/application/createShippingRule';
import { getShippingRuleById } from '@Modules/shipping/application/getShippingRuleById';
import { listShippingRules } from '@Modules/shipping/application/listShippingRules';
import { listDeletedShippingRules } from '@Modules/shipping/application/listDeletedShippingRules';
import { deleteShippingRuleLogical } from '@Modules/shipping/application/deleteShippingRuleLogical';
import { deleteShippingRulePhysical } from '@Modules/shipping/application/deleteShippingRulePhysical';
import { restoreShippingRule } from '@Modules/shipping/application/restoreShippingRule';
import { deleteShippingRulesBulk } from '@Modules/shipping/application/deleteShippingRulesBulk';
import { restoreShippingRulesBulk } from '@Modules/shipping/application/restoreShippingRulesBulk';
import { purgeShippingRulesBulk } from '@Modules/shipping/application/purgeShippingRulesBulk';
import { ShippingRuleNotFoundError } from '@Modules/shipping/domain/errors/ShippingErrors';

withMongo();

function payload(name: string, overrides: Record<string, unknown> = {}) {
	return {
		name,
		type: 'flat' as const,
		amount: { amount: 1000, currency: 'USD' },
		zones: [],
		isActive: true,
		order: 0,
		...overrides,
	};
}

describe('shipping rule lifecycle', () => {
	it('getShippingRuleById returns the rule, and 404s once soft-deleted', async () => {
		const created = await createShippingRule(payload('Lifecycle rule'));
		await expect(getShippingRuleById(created.id)).resolves.toMatchObject({
			id: created.id,
		});

		await deleteShippingRuleLogical(created.id);
		await expect(getShippingRuleById(created.id)).rejects.toBeInstanceOf(
			ShippingRuleNotFoundError,
		);
	});

	it('listShippingRules filters by isActive and search', async () => {
		await createShippingRule(payload('Winter flat'));
		await createShippingRule(payload('Summer flat', { isActive: false }));

		const active = await listShippingRules({ page: 1, limit: 10, isActive: true });
		expect(active.data.map((r) => r.name)).toContain('Winter flat');
		expect(active.data.map((r) => r.name)).not.toContain('Summer flat');

		const searched = await listShippingRules({ page: 1, limit: 10, search: 'winter' });
		expect(searched.data).toHaveLength(1);
	});

	it('soft-delete then restore round-trips through the trash listing', async () => {
		const created = await createShippingRule(payload('Trash me'));
		await deleteShippingRuleLogical(created.id);

		const trash = await listDeletedShippingRules({ page: 1, limit: 10 });
		expect(trash.data.map((r) => r.id)).toContain(created.id);

		await restoreShippingRule(created.id);
		const active = await listShippingRules({ page: 1, limit: 10 });
		expect(active.data.map((r) => r.id)).toContain(created.id);
	});

	it('deleteShippingRulePhysical removes a trashed rule permanently', async () => {
		const created = await createShippingRule(payload('Purge me'));
		await deleteShippingRuleLogical(created.id);

		await deleteShippingRulePhysical(created.id);
		await expect(getShippingRuleById(created.id)).rejects.toBeInstanceOf(
			ShippingRuleNotFoundError,
		);
	});

	it('bulk soft-delete, restore, and purge report processed/notFound ids', async () => {
		const a = await createShippingRule(payload('Bulk A'));
		const b = await createShippingRule(payload('Bulk B'));
		const missingId = crypto.randomUUID();

		const expectedIds = new Set([a.id, b.id]);

		const deleted = await deleteShippingRulesBulk([a.id, b.id, missingId]);
		expect(new Set(deleted.processedIds)).toEqual(expectedIds);
		expect(deleted.notFoundIds).toEqual([missingId]);

		const restored = await restoreShippingRulesBulk([a.id, b.id]);
		expect(new Set(restored.processedIds)).toEqual(expectedIds);

		await deleteShippingRulesBulk([a.id, b.id]);
		const purged = await purgeShippingRulesBulk([a.id, b.id]);
		expect(new Set(purged.processedIds)).toEqual(expectedIds);

		await expect(getShippingRuleById(a.id)).rejects.toBeInstanceOf(
			ShippingRuleNotFoundError,
		);
	});
});
