import configEnvironment from '@Constants/environments';
import { SySTEM_ENVIRONMENT } from '@Constants/systemEnvironment';

export function isDevelopmentEnvironment() {
	const isDevelopment =
		configEnvironment.ENVIRONMENT === SySTEM_ENVIRONMENT.DEVELOPMENT;

	return {
		isDevelopment,
	};
}
