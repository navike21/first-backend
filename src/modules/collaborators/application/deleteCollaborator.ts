import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CollaboratorNotFoundError } from '../domain/errors/CollaboratorErrors';

export async function deleteCollaborator(id: string) {
	const doc = await CollaboratorModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CollaboratorNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
