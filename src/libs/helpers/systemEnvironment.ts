import configEnvironment from '@Config/environments';
import { SySTEM_ENVIRONMENT } from '@Constants/systemEnvironment';

export function isDevelopmentEnvironment() {
	const isDevelopment =
		configEnvironment.NODE_ENV === SySTEM_ENVIRONMENT.DEVELOPMENT;

	return {
		isDevelopment,
	};
}
