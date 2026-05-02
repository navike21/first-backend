import i18next from 'i18next';
import { locales, SUPPORTED_LANGS } from '../locales';
import { authLocales } from '../modules/auth/locales';
import { usersLocales } from '../modules/users/locales';
import { userGroupsLocales } from '../modules/user-groups/locales';
import { subscribersLocales } from '../modules/subscribers/locales';

export async function initI18n(): Promise<void> {
	const resources = Object.fromEntries(
		SUPPORTED_LANGS.map((lang) => [
			lang,
			{
				errors: locales[lang],
				auth: authLocales[lang],
				users: usersLocales[lang],
				'user-groups': userGroupsLocales[lang],
				subscribers: subscribersLocales[lang],
			},
		]),
	);

	await i18next.init({
		lng: 'en',
		fallbackLng: 'en',
		supportedLngs: SUPPORTED_LANGS,
		resources,
		interpolation: { escapeValue: false },
		ns: ['errors', 'auth', 'users', 'user-groups', 'subscribers'],
		defaultNS: 'errors',
	});
}

export default i18next;
