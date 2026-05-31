import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PageModel from '../infrastructure/PageModel';

export async function deletePagePhysical(slug: string) {
	const page = await PageModel.findOne({ slug, deletedAt: { $ne: null } }).lean();
	if (!page) AppError.notFound('PAGE_NOT_FOUND', 'Page not found in trash');

	await PageModel.deleteOne({ slug });
	return cleanMongoFields(page);
}
