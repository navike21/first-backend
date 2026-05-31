import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';

export async function purgeCollaborator(id: string) {
	const doc = await CollaboratorModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!doc) AppError.notFound('COLLABORATOR_NOT_FOUND', 'Collaborator not found in trash');

	await CollaboratorModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
