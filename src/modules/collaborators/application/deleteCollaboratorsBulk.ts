import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CollaboratorModel from '../infrastructure/CollaboratorModel';

export async function deleteCollaboratorsBulk(ids: string[]) {
	const docs = await CollaboratorModel.find({ id: { $in: ids }, deletedAt: null }).lean();

	const processedIds = docs.map((d) => d.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await CollaboratorModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
