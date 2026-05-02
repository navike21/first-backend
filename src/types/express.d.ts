import { TFunction } from 'i18next';

declare module 'express-serve-static-core' {
	interface Request {
		lang?: TFunction;
	}
}
