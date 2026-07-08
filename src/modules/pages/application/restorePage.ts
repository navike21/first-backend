import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PageModel from '../infrastructure/PageModel';

export async function restorePage(id: string) {
	const page = await PageModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!page) AppError.notFound('PAGE_NOT_FOUND', 'Page not found in trash');

	await PageModel.findOneAndUpdate({ id, deletedAt: { $ne: null } }, { $unset: { deletedAt: '' } });
	return cleanMongoFields({ ...page, deletedAt: undefined });
}
