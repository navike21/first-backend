import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import PaymentMethodModel from '../infrastructure/PaymentMethodModel';

interface ListPaymentMethodsParams {
	page: number;
	limit: number;
	customerId?: string;
	provider?: string;
}

export async function listPaymentMethods({
	page,
	limit,
	customerId,
	provider,
}: ListPaymentMethodsParams) {
	const skip = (page - 1) * limit;

	const query: Record<string, unknown> = { deletedAt: null };
	if (customerId) query.customerId = customerId;
	if (provider) query.provider = provider;

	const [data, total] = await Promise.all([
		PaymentMethodModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
		PaymentMethodModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
