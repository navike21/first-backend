import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CustomerModel } from '@Modules/customers';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import { CustomerAlreadyRegisteredError } from '../domain/errors/CustomerAuthErrors';
import type { RegisterCustomerInput } from '../schemas/customerAuth.schema';

/**
 * Self-service registration for the customer realm (no admin/staff CRUD
 * involved — `customers` module's own create/update stay reserved for
 * staff-managed records). Reuses `HashedPassword` from `auth` as-is: it is a
 * fully generic bcrypt wrapper with nothing staff-specific.
 */
export async function registerCustomer(input: RegisterCustomerInput) {
	const existing = await CustomerModel.findOne({
		email: input.email,
		deletedAt: null,
	}).lean();
	if (existing) throw new CustomerAlreadyRegisteredError();

	const passwordHash = await HashedPassword.hash(input.password);

	const doc = await CustomerModel.create({
		firstName: input.firstName,
		lastName: input.lastName,
		email: input.email,
		passwordHash,
		emailVerified: false,
		addresses: [],
	});

	return cleanMongoFields(doc.toObject());
}
