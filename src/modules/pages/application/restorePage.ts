import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PageModel from '../infrastructure/PageModel';

export async function restorePage(slug: string) {
	const page = await PageModel.findOne({ slug, status: 'deleted' }).lean();
	if (!page) AppError.notFound('PAGE_NOT_FOUND', 'Page not found in trash');

	await PageModel.findOneAndUpdate(
		{ slug, status: 'deleted' },
		{ $set: { status: 'draft' }, $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...page, status: 'draft', deletedAt: undefined });
}
