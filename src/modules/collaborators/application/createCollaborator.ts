import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { createCollaboratorInput } from '../schemas/collaborator.schema';

export async function createCollaborator(input: createCollaboratorInput) {
	const doc = await CollaboratorModel.create(input);
	return cleanMongoFields(doc.toObject());
}
