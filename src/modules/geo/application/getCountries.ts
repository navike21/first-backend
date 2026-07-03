import { COUNTRIES } from '../data';

export function getCountries(lang: string) {
	let dn: Intl.DisplayNames | null = null;
	try {
		dn = new Intl.DisplayNames([lang], { type: 'region' });
	} catch {
		// Unknown locale — fall back to stored names
	}

	return COUNTRIES.map(({ name, nameEn, ...rest }) => ({
		...rest,
		name: dn?.of(rest.code) ?? (lang === 'en' ? nameEn : name),
	}));
}
