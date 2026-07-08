import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import { AppError } from '@Shared/domain/AppError';
import PageModel from '../infrastructure/PageModel';
import PageRevisionModel from '../infrastructure/PageRevisionModel';
import { PAGE_ENTITY_TYPE } from '../constants/paths';
import { PageHasChildrenError } from '../domain/errors/PageErrors';

export async function deletePagePhysical(id: string) {
	const page = await PageModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!page) AppError.notFound('PAGE_NOT_FOUND', 'Page not found in trash');

	const hasChildren = await PageModel.exists({ parentId: id, deletedAt: null });
	if (hasChildren) throw new PageHasChildrenError();

	await PageModel.deleteOne({ id });
	await PageRevisionModel.deleteMany({ pageId: id });
	await deleteEntityFiles(PAGE_ENTITY_TYPE, id).catch(() => {});

	return cleanMongoFields(page);
}
