import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { COLLABORATOR_ENTITY_TYPE } from '../constants/paths';

export async function purgeCollaboratorsBulk(ids: string[]) {
	const docs = await CollaboratorModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = docs.map((d) => d.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await CollaboratorModel.deleteMany({ id: { $in: processedIds } });
	await Promise.all(
		processedIds.map((id) =>
			deleteEntityFiles(COLLABORATOR_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
