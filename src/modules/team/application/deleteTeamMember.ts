import TeamMemberModel from '../infrastructure/TeamMemberModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { TeamMemberNotFoundError } from '../domain/errors/TeamErrors';

export async function deleteTeamMember(id: string) {
	const doc = await TeamMemberModel.findOne({ id, status: { $ne: 'deleted' } });
	if (!doc) throw new TeamMemberNotFoundError();

	doc.status = 'deleted';
	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
