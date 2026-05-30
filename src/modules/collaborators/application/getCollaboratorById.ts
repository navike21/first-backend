import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CollaboratorNotFoundError } from '../domain/errors/CollaboratorErrors';

export async function getCollaboratorById(id: string) {
	const doc = await CollaboratorModel.findOne({
		id,
		status: { $ne: 'deleted' },
	}).lean();
	if (!doc) throw new CollaboratorNotFoundError();
	return cleanMongoFields(doc);
}
