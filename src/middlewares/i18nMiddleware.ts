import type { NextFunction, Request, Response } from 'express';
import { SUPPORTED_LANGS } from '../locales';

const SUPPORTED_SET = new Set(SUPPORTED_LANGS);
const DEFAULT_LANG = 'en';

export const i18nMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const acceptLanguage = req.headers['accept-language'] ?? DEFAULT_LANG;
	const lang =
		acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase() ?? DEFAULT_LANG;
	res.locals.lang = SUPPORTED_SET.has(lang as never) ? lang : DEFAULT_LANG;
	next();
};
