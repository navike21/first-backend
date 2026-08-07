import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PaymentMethodModel from '../infrastructure/PaymentMethodModel';

export async function purgePaymentMethodsBulk(ids: string[]) {
	const docs = await PaymentMethodModel.find({
		id: { $in: ids },
		deletedAt: { $ne: null },
	}).lean();

	const processedIds = docs
		.map((d) => d.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PaymentMethodModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
