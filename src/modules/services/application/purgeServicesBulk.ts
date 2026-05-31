import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ServiceModel from '../infrastructure/ServiceModel';

export async function purgeServicesBulk(ids: string[]) {
	const services = await ServiceModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = services.map((s) => s.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await ServiceModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: services.map((s) => cleanMongoFields(s)),
		processedIds,
		notFoundIds,
	};
}
