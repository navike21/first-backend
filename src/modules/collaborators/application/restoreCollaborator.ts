import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import CollaboratorModel from '../infrastructure/CollaboratorModel';

export async function restoreCollaborator(id: string) {
	const doc = await CollaboratorModel.findOne({ id, status: 'deleted' }).lean();
	if (!doc) AppError.notFound('COLLABORATOR_NOT_FOUND', 'Collaborator not found in trash');

	await CollaboratorModel.findOneAndUpdate(
		{ id, status: 'deleted' },
		{ $set: { status: 'active' }, $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, status: 'active', deletedAt: undefined });
}
