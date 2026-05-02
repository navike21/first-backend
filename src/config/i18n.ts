import i18next from 'i18next';

import enErrors from '../locales/en/errors.json';
import esErrors from '../locales/es/errors.json';

export async function initI18n(): Promise<void> {
	await i18next.init({
		lng: 'en',
		fallbackLng: 'en',
		supportedLngs: ['en', 'es'],
		resources: {
			en: { errors: enErrors },
			es: { errors: esErrors },
		},
		interpolation: { escapeValue: false },
		ns: ['errors'],
		defaultNS: 'errors',
	});
}

export default i18next;
