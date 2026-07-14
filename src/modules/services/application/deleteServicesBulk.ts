import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ServiceModel from '../infrastructure/ServiceModel';

export async function deleteServicesBulk(ids: string[]) {
	const services = await ServiceModel.find({
		id: { $in: ids },
		deletedAt: null,
	}).lean();

	const processedIds = services
		.map((s) => s.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await ServiceModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: services.map((s) => cleanMongoFields(s)),
		processedIds,
		notFoundIds,
	};
}
