import UserModel from '../infrastructure/UserModel';
import type { UserPreferences } from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';
import type { UpdatePreferencesInput } from '../schemas/user.schema';

/**
 * Partially updates the authenticated user's UI preferences (language, theme).
 * Returns the merged preferences so the frontend can apply them.
 */
export async function updateMyPreferences(
	userId: string,
	input: UpdatePreferencesInput,
): Promise<UserPreferences> {
	const user = await UserModel.findOne({ id: userId });
	if (!user) throw new UserNotFoundError();

	// Zod omits unset optional keys, so every provided entry is a real change.
	for (const [key, value] of Object.entries(input)) {
		user.set(`preferences.${key}`, value);
	}
	await user.save();

	return user.preferences;
}
