import TeamMemberModel from '../infrastructure/TeamMemberModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { TeamMemberNotFoundError } from '../domain/errors/TeamErrors';
import { UpdateTeamMemberInput } from '../schemas/team.schema';

export async function updateTeamMember(
	id: string,
	input: UpdateTeamMemberInput,
) {
	const doc = await TeamMemberModel.findOne({ id, status: { $ne: 'deleted' } });
	if (!doc) throw new TeamMemberNotFoundError();

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
