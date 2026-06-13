import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import ServiceModel from '../infrastructure/ServiceModel';
import { SERVICE_ENTITY_TYPE } from '../constants/paths';

export async function purgeServicesBulk(ids: string[]) {
	const services = await ServiceModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = services.map((s) => s.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await ServiceModel.deleteMany({ id: { $in: processedIds } });
	await Promise.all(
		processedIds.map((id) =>
			deleteEntityFiles(SERVICE_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return {
		processed: services.map((s) => cleanMongoFields(s)),
		processedIds,
		notFoundIds,
	};
}
