import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PortfolioNotFoundError } from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';

export async function getPortfolioBySlug(slug: string) {
	const portfolio = await PortfolioModel.findOne({
		slug,
		status: 'published',
	}).lean();
	if (!portfolio) throw new PortfolioNotFoundError();

	const cleaned = cleanMongoFields(portfolio);

	const clientDoc = portfolio.clientId
		? await ClientModel.findOne({
				id: portfolio.clientId,
				deletedAt: null,
			})
				.select({ businessName: 1, logoUrl: 1, website: 1 })
				.lean()
		: null;
	const client = clientDoc ? cleanMongoFields(clientDoc) : null;

	const rawServiceDocs =
		portfolio.serviceIds.length > 0
			? await ServiceModel.find({
					id: { $in: portfolio.serviceIds },
					status: 'active',
				})
					.select({ id: 1, slug: 1, name: 1, shortDescription: 1, icon: 1 })
					.lean()
			: [];
	const services = rawServiceDocs.map(cleanMongoFields);

	return { ...cleaned, client, services };
}
