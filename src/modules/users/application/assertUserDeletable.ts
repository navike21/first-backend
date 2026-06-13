import { PERMISSIONS } from '@Constants/permissions';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import UserModel from '../infrastructure/UserModel';
import {
	CannotDeleteSelfError,
	LastSuperAdminError,
} from '../domain/errors/UserErrors';

/**
 * Guards destructive user operations:
 *  - a user can never delete their own account;
 *  - the last active super-admin (a user whose group holds `*:*`) cannot be
 *    removed, so the system always keeps at least one full administrator.
 *
 * Imports the group model directly (not via the module index) to avoid the
 * users ↔ user-groups ↔ auth import cycle.
 */
export async function assertUserDeletable(
	targetId: string,
	requesterId?: string,
): Promise<void> {
	if (requesterId && targetId === requesterId) {
		throw new CannotDeleteSelfError();
	}

	const target = await UserModel.findOne({ id: targetId }).lean();
	if (!target?.groupId) return;

	const group = await UserGroupModel.findOne({ id: target.groupId }).lean();
	const isSuper = group?.permissions?.includes(PERMISSIONS.ALL) ?? false;
	if (!isSuper) return;

	const otherActiveSupers = await UserModel.countDocuments({
		groupId: target.groupId,
		deletedAt: null,
		id: { $ne: targetId },
	});
	if (otherActiveSupers === 0) {
		throw new LastSuperAdminError();
	}
}
