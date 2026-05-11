import en from './en/errors.json';
import es from './es/errors.json';
import de from './de/errors.json';
import fr from './fr/errors.json';
import it from './it/errors.json';
import ja from './ja/errors.json';
import ko from './ko/errors.json';
import pt from './pt/errors.json';
import ru from './ru/errors.json';
import zh from './zh/errors.json';

export const locales = { en, es, de, fr, it, ja, ko, pt, ru, zh } as const;

export type SupportedLang = keyof typeof locales;

export const SUPPORTED_LANGS = Object.keys(locales) as SupportedLang[];
