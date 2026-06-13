import { eventBus } from '@Shared/infrastructure/EventBus';
import { logError } from '@Helpers/log';
import { getAppSettings, APP_SETTINGS_DEFAULTS } from '@Modules/app-settings';
import {
	EMAIL_EVENTS,
	type UserRegisteredEvent,
	type PasswordResetRequestedEvent,
	type EmailVerifiedEvent,
} from '@Shared/events/emailEvents';
import { sendEmail } from './sendEmail';
import { verifyEmailTemplate } from '../templates/verifyEmail.template';
import { welcomeEmailTemplate } from '../templates/welcomeEmail.template';
import { passwordResetTemplate } from '../templates/passwordReset.template';

/**
 * Fire-and-forget delivery: a failed email must never break the request that
 * produced the event, so errors are logged and swallowed (not awaited upstream).
 */
function dispatch(promise: Promise<void>): void {
	promise.catch((error) => logError(`[email] delivery failed: ${error}`));
}

/** Brand name for emails, from app-settings (cached); never throws. */
async function resolveAppName(): Promise<string> {
	try {
		return (await getAppSettings()).general.appName;
	} catch {
		return APP_SETTINGS_DEFAULTS.general.appName;
	}
}

let registered = false;

/**
 * Wires the email side-effects to domain events. Called once at app startup.
 * Decouples email sending from the request path (latency + failures no longer
 * affect createUser / forgotPassword / verifyEmail). The email brand comes from
 * app-settings (`general.appName`), not a hardcoded string.
 */
export function registerEmailSubscribers(): void {
	if (registered) return;
	registered = true;

	eventBus.subscribe<UserRegisteredEvent>(
		EMAIL_EVENTS.USER_REGISTERED,
		(event) => {
			dispatch(
				resolveAppName().then((appName) =>
					sendEmail({
						to: event.email,
						...verifyEmailTemplate({
							firstName: event.firstName,
							verificationUrl: event.verificationUrl,
							lang: event.lang,
							appName,
						}),
					}),
				),
			);
		},
	);

	eventBus.subscribe<PasswordResetRequestedEvent>(
		EMAIL_EVENTS.PASSWORD_RESET_REQUESTED,
		(event) => {
			dispatch(
				resolveAppName().then((appName) =>
					sendEmail({
						to: event.email,
						...passwordResetTemplate({
							firstName: event.firstName,
							resetUrl: event.resetUrl,
							lang: event.lang,
							appName,
						}),
					}),
				),
			);
		},
	);

	eventBus.subscribe<EmailVerifiedEvent>(
		EMAIL_EVENTS.EMAIL_VERIFIED,
		(event) => {
			dispatch(
				resolveAppName().then((appName) =>
					sendEmail({
						to: event.email,
						...welcomeEmailTemplate({
							firstName: event.firstName,
							lang: event.lang,
							appName,
						}),
					}),
				),
			);
		},
	);
}
