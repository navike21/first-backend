import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ServiceNotFoundError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';

const SLUG_LANGS = [
	'en',
	'es',
	'de',
	'fr',
	'it',
	'ja',
	'ko',
	'pt',
	'ru',
	'zh',
] as const;

export async function getServiceBySlug(slug: string) {
	const service = await ServiceModel.findOne({
		$or: SLUG_LANGS.map((l) => ({ [`slug.${l}`]: slug })),
		isActive: true,
		status: 'active',
	}).lean();
	if (!service) throw new ServiceNotFoundError();
	return cleanMongoFields(service);
}
