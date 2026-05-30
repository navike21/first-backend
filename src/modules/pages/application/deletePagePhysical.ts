import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PageModel from '../infrastructure/PageModel';

export async function deletePagePhysical(slug: string) {
	const deleted = await PageModel.findOneAndDelete({ slug }).lean();
	if (!deleted) AppError.notFound('PAGE_NOT_FOUND', 'Page not found');
	return cleanMongoFields(deleted);
}
