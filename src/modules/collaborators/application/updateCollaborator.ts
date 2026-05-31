import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CollaboratorNotFoundError } from '../domain/errors/CollaboratorErrors';
import { updateCollaboratorInput } from '../schemas/collaborator.schema';

export async function updateCollaborator(
	id: string,
	input: updateCollaboratorInput,
) {
	const doc = await CollaboratorModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CollaboratorNotFoundError();

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
