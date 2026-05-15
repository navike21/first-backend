import TeamMemberModel from '../infrastructure/TeamMemberModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CreateTeamMemberInput } from '../schemas/team.schema';

export async function createTeamMember(input: CreateTeamMemberInput) {
	const doc = await TeamMemberModel.create(input);
	return cleanMongoFields(doc.toObject());
}
