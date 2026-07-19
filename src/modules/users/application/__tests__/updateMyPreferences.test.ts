import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { updateMyPreferences } from '@Modules/users/application/updateMyPreferences';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

const seedUser = () =>
	UserModel.create({
		email: `me-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'h',
		firstName: 'Aa',
		lastName: 'Bb',
	});

describe('updateMyPreferences', () => {
	it('defaults theme to "system" for a new user', async () => {
		const user = await seedUser();
		const inDb = await UserModel.findOne({ id: user.id }).lean();
		expect(inDb!.preferences.theme).toBe('system');
	});

	it('updates theme and language', async () => {
		const user = await seedUser();

		const prefs = await updateMyPreferences(user.id, {
			theme: 'dark',
			language: 'es',
		});

		expect(prefs.theme).toBe('dark');
		expect(prefs.language).toBe('es');
	});

	it('merges partial updates, leaving other preferences intact', async () => {
		const user = await seedUser();
		await updateMyPreferences(user.id, { language: 'en', theme: 'light' });

		const prefs = await updateMyPreferences(user.id, { theme: 'dark' });

		expect(prefs.theme).toBe('dark');
		expect(prefs.language).toBe('en');
	});

	it('throws UserNotFoundError when the user does not exist', async () => {
		await expect(
			updateMyPreferences('nonexistent', { theme: 'dark' }),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});
});
