import { UpdateUserGroupInput } from '../schemas/userGroup.schema';
import UserGroupModel from '../infrastructure/UserGroupModel';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
	UserGroupSlugConflictError,
} from '../domain/errors/UserGroupErrors';

function toSlug(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replaceAll(/\s+/g, '-')
		.replaceAll(/[^a-z0-9-]/g, '')
		.replaceAll(/-+/g, '-');
}

export async function updateUserGroup(id: string, input: UpdateUserGroupInput) {
	const group = await UserGroupModel.findOne({ id });
	if (!group) throw new UserGroupNotFoundError();
	if (group.isSystem) throw new SystemGroupModificationError();

	if (input.name) {
		const slug = toSlug(input.name);
		const conflict = await UserGroupModel.findOne({ slug, id: { $ne: id } });
		if (conflict) throw new UserGroupSlugConflictError();
		(input as Record<string, unknown>).slug = slug;
	}

	Object.assign(group, input);
	await group.save();
	return group;
}
