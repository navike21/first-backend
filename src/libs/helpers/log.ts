import { isDevelopmentEnvironment } from './systemEnvironment';

const { isDevelopment } = isDevelopmentEnvironment();

type Log = string | object;

function formatMessage(message: Log): string {
	return typeof message === 'object'
		? JSON.stringify(message, null, 2)
		: message;
}

export function logInfo(message: Log): void {
	if (isDevelopment) {
		console.log(`INFO: ${formatMessage(message)}`);
	}
}

export function logError(message: Log): void {
	if (isDevelopment) {
		console.error(`ERROR: ${formatMessage(message)}`);
	}
}
