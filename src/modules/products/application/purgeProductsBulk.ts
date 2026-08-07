import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import ProductModel from '../infrastructure/ProductModel';
import { PRODUCT_ENTITY_TYPE } from '../constants/paths';

export async function purgeProductsBulk(ids: string[]) {
	const docs = await ProductModel.find({
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

	await ProductModel.deleteMany({ id: { $in: processedIds } });
	await Promise.all(
		processedIds.map((id) =>
			deleteEntityFiles(PRODUCT_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
