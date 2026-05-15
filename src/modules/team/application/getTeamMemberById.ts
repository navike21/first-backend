import TeamMemberModel from '../infrastructure/TeamMemberModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { TeamMemberNotFoundError } from '../domain/errors/TeamErrors';

export async function getTeamMemberById(id: string) {
	const doc = await TeamMemberModel.findOne({
		id,
		status: { $ne: 'deleted' },
	}).lean();
	if (!doc) throw new TeamMemberNotFoundError();
	return cleanMongoFields(doc);
}
