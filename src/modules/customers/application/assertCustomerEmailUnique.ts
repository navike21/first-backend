import CustomerModel from '../infrastructure/CustomerModel';
import { CustomerEmailConflictError } from '../domain/errors/CustomerErrors';

/**
 * Pre-check for the customer email uniqueness key. UX-only: the partial
 * unique index on `email` (scoped to `deletedAt: null`) is the real source
 * of truth — same precedent as `assertClientUnique`.
 */
export async function assertCustomerEmailUnique(
	email: string,
	excludeId?: string,
): Promise<void> {
	const query: Record<string, unknown> = { email, deletedAt: null };
	if (excludeId) query.id = { $ne: excludeId };

	const existing = await CustomerModel.findOne(query).lean();
	if (existing) throw new CustomerEmailConflictError();
}
