import { SySTEM_ENVIRONMENT } from '@Constants/systemEnvironment';

export function isDevelopmentEnvironment() {
	const isDevelopment =
		process.env.NODE_ENV === SySTEM_ENVIRONMENT.DEVELOPMENT;

	return {
		isDevelopment,
	};
}
