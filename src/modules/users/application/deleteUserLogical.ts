import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import {
	UserNotFoundError,
	LastSuperAdminError,
} from '../domain/errors/UserErrors';
import {
	assertNotSelfDelete,
	hasOtherActiveSuperAdmin,
} from './assertUserDeletable';

/**
 * Soft-deletes atomically, then re-verifies the last-super-admin invariant
 * against the post-write state and compensates (restores) if it was
 * violated. Closes most of the check-then-act race a pre-write check would
 * have: two concurrent deletes of the last two super-admins can no longer
 * both slip through unnoticed, since each re-checks in-band with its own
 * write. A narrow window remains if both requests' rechecks run before
 * either write has propagated to the other — operationally unlikely given
 * both hit the same MongoDB primary — see `assertUserDeletable.ts`.
 */
export async function deleteUserLogical(id: string, requesterId?: string) {
	assertNotSelfDelete(id, requesterId);

	const user = await UserModel.findOneAndUpdate(
		{ id, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	).lean();
	if (!user) throw new UserNotFoundError();

	const stillSafe = await hasOtherActiveSuperAdmin(id, user.groupIds);
	if (!stillSafe) {
		await UserModel.updateOne({ id }, { $set: { deletedAt: null } });
		throw new LastSuperAdminError();
	}

	return cleanMongoFields({ ...user, password: undefined });
}
