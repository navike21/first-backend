/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import configEnvironment from '@Config/environments';

export const logInfo = (message: string): void => {
	if (configEnvironment.NODE_ENV === 'development') {
		console.log(`INFO: ${message}`);
	}
};

export const logError = (message: string): void => {
	if (configEnvironment.NODE_ENV === 'development') {
		console.error(`ERROR: ${message}`);
	}
};
