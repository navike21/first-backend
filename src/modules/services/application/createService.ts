import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { generateSlug } from '@Helpers/generateSlug';
import { ServiceSlugConflictError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';
import type { CreateServiceInput } from '../schemas/service.schema';

export async function createService(input: CreateServiceInput) {
	const slug = input.slug ?? generateSlug(input.name.en);

	const existing = await ServiceModel.findOne({ slug });
	if (existing) throw new ServiceSlugConflictError();

	const service = await ServiceModel.create({ ...input, slug });
	return cleanMongoFields(service.toObject({ versionKey: false, getters: true }));
}
