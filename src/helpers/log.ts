import { isDevelopmentEnvironment } from './systemEnvironment';

const { isDevelopment } = isDevelopmentEnvironment();

export type Log = string | object;

function formatMessage(message: Log): string {
	return typeof message === 'object'
		? JSON.stringify(message, null, 2)
		: message;
}

export function logInfo(message: Log): void {
	if (isDevelopment) {
		// eslint-disable-next-line no-console
		console.log(`INFO: ${formatMessage(message)}`);
	}
}

export function logError(message: Log): void {
	// Unlike logInfo, this must never be gated behind isDevelopment — an
	// unhandled error is exactly the thing production needs visibility into,
	// and silencing it here left every real crash invisible in prod logs.
	// eslint-disable-next-line no-console
	console.error(`ERROR: ${formatMessage(message)}`);
}
