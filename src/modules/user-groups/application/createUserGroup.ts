import { CreateUserGroupInput } from '../schemas/userGroup.schema';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupSlugConflictError } from '../domain/errors/UserGroupErrors';

function toSlug(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replaceAll(/\s+/g, '-')
		.replaceAll(/[^a-z0-9-]/g, '')
		.replaceAll(/-+/g, '-');
}

export async function createUserGroup(input: CreateUserGroupInput) {
	const slug = toSlug(input.name);

	const existing = await UserGroupModel.findOne({ slug });
	if (existing) throw new UserGroupSlugConflictError();

	const group = await UserGroupModel.create({ ...input, slug });
	return group;
}
