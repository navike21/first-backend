import { PERMISSIONS } from '@Constants/permissions';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import UserModel from '../infrastructure/UserModel';
import {
	CannotDeleteSelfError,
	LastSuperAdminError,
} from '../domain/errors/UserErrors';

/** A user can never delete their own account. Pure/sync — no race risk. */
export function assertNotSelfDelete(
	targetId: string,
	requesterId?: string,
): void {
	if (requesterId && targetId === requesterId) {
		throw new CannotDeleteSelfError();
	}
}

/**
 * Whether at least one OTHER active user besides `excludeId` still holds a
 * super group (`*:*`). Takes `groupIds` directly so a caller that just
 * wrote/read the target (e.g. `deleteUserLogical`'s post-write recheck)
 * doesn't need a redundant lookup.
 *
 * Imports the group model directly (not via the module index) to avoid the
 * users ↔ user-groups ↔ auth import cycle.
 */
export async function hasOtherActiveSuperAdmin(
	excludeId: string,
	groupIds: string[] | undefined,
): Promise<boolean> {
	if (!groupIds?.length) return true;

	// Super groups (holding `*:*`) the target belongs to.
	// `find().select().lean()` instead of `.distinct()`: the prod connection uses
	// MongoDB Stable API v1 (strict), which rejects the `distinct` command.
	const superGroups = await UserGroupModel.find({
		id: { $in: groupIds },
		permissions: PERMISSIONS.ALL,
	})
		.select('id')
		.lean();
	const superGroupIds = superGroups.map((g) => g.id);
	if (superGroupIds.length === 0) return true;

	// At least one OTHER active user must remain in any of those super groups.
	const otherActiveSupers = await UserModel.countDocuments({
		groupIds: { $in: superGroupIds },
		deletedAt: null,
		id: { $ne: excludeId },
	});
	return otherActiveSupers > 0;
}

/**
 * Guards destructive user operations:
 *  - a user can never delete their own account;
 *  - the last active super-admin (a user whose group holds `*:*`) cannot be
 *    removed, so the system always keeps at least one full administrator.
 *
 * This check-then-act is inherently racy under concurrent requests (two
 * concurrent deletes of the last two super-admins could both read "at least
 * one other" and both proceed). Used as-is for the physical-purge path
 * (`deleteUser`), where the target is already inactive (soft-deleted) and
 * the invariant is "don't destroy the last historical record", not a
 * real-time active-admin count. `deleteUserLogical` (the soft-delete path,
 * where the active-admin count actually changes) instead writes first and
 * re-verifies after, compensating if the write turns out to violate the
 * invariant — see that file for the narrower race window this leaves.
 */
export async function assertUserDeletable(
	targetId: string,
	requesterId?: string,
): Promise<void> {
	assertNotSelfDelete(targetId, requesterId);

	const target = await UserModel.findOne({ id: targetId }).lean();
	const safe = await hasOtherActiveSuperAdmin(targetId, target?.groupIds);
	if (!safe) {
		throw new LastSuperAdminError();
	}
}
