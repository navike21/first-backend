import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';
import { withEffectiveStatus } from './pageStatus';

export async function getPageById(id: string) {
	const doc = await PageModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new PageNotFoundError();
	return withEffectiveStatus(cleanMongoFields(doc));
}
