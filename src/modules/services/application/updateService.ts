import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	ServiceNotFoundError,
	ServiceSlugConflictError,
} from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';
import type { UpdateServiceInput } from '../schemas/service.schema';

export async function updateService(id: string, input: UpdateServiceInput) {
	const service = await ServiceModel.findOne({ id, status: 'active' });
	if (!service) throw new ServiceNotFoundError();

	if (input.slug) {
		const conflict = await ServiceModel.findOne({
			slug: input.slug,
			id: { $ne: id },
		});
		if (conflict) throw new ServiceSlugConflictError();
	}

	Object.assign(service, input);
	await service.save();
	return cleanMongoFields(
		service.toObject({ versionKey: false, getters: true }),
	);
}
