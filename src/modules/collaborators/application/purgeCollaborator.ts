import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';

export async function purgeCollaborator(id: string) {
	const deleted = await CollaboratorModel.findOneAndDelete({ id }).lean();
	if (!deleted) AppError.notFound('COLLABORATOR_NOT_FOUND', 'Collaborator not found');
	return cleanMongoFields(deleted);
}
