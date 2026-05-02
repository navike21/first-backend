import type { NextFunction, Request, Response } from 'express';

const SUPPORTED_LANGS = ['en', 'es'];
const DEFAULT_LANG = 'en';

export const i18nMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const acceptLanguage = req.headers['accept-language'] ?? DEFAULT_LANG;
	const lang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase() ?? DEFAULT_LANG;
	res.locals.lang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
	next();
};
