import { CreateUserGroupInput } from '../schemas/userGroup.schema';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupSlugConflictError } from '../domain/errors/UserGroupErrors';
import { toSlug } from '../utils/slug';

export async function createUserGroup(input: CreateUserGroupInput) {
	const slug = toSlug(input.name);

	const existing = await UserGroupModel.findOne({ slug });
	if (existing) throw new UserGroupSlugConflictError();

	const group = await UserGroupModel.create({ ...input, slug });
	return group;
}
