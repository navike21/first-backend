import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { deleteEntityFiles } from '@Modules/storage';
import { COLLABORATOR_ENTITY_TYPE } from '../constants/paths';

export async function purgeCollaborator(id: string) {
	const doc = await CollaboratorModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound(
			'COLLABORATOR_NOT_FOUND',
			'Collaborator not found in trash',
		);

	await CollaboratorModel.deleteOne({ id });
	await deleteEntityFiles(COLLABORATOR_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields(doc);
}
