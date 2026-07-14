import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import CollaboratorModel from '../infrastructure/CollaboratorModel';

export async function restoreCollaborator(id: string) {
	const doc = await CollaboratorModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound(
			'COLLABORATOR_NOT_FOUND',
			'Collaborator not found in trash',
		);

	await CollaboratorModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
