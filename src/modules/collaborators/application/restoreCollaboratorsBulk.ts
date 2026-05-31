import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CollaboratorModel from '../infrastructure/CollaboratorModel';

export async function restoreCollaboratorsBulk(ids: string[]) {
	const docs = await CollaboratorModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = docs.map((d) => d.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await CollaboratorModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: docs.map((d) => cleanMongoFields({ ...d, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
