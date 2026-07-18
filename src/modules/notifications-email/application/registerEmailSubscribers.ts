import { eventBus } from '@Shared/infrastructure/EventBus';
import { logError } from '@Helpers/log';
import { getAppSettings, APP_SETTINGS_DEFAULTS } from '@Modules/app-settings';
import {
	EMAIL_EVENTS,
	type UserRegisteredEvent,
	type PasswordResetRequestedEvent,
	type EmailVerifiedEvent,
	type FormSubmissionReceivedEvent,
} from '@Shared/events/emailEvents';
import { enqueueEmail } from './enqueueEmail';
import { verifyEmailTemplate } from '../templates/verifyEmail.template';
import { welcomeEmailTemplate } from '../templates/welcomeEmail.template';
import { passwordResetTemplate } from '../templates/passwordReset.template';
import { formSubmissionReceivedTemplate } from '../templates/formSubmissionReceived.template';

/**
 * Encola de forma durable, esperando el insert al outbox pero sin dejar que un
 * fallo rompa el request que produjo el evento. A diferencia del envío antiguo
 * (fire-and-forget de una promesa flotante que en serverless se perdía), acá el
 * enqueue SÍ se espera —es un insert rápido— así el correo queda persistido
 * antes de responder; el envío real lo hace el worker aparte. Los errores se
 * loguean y se tragan (crear el usuario no debe fallar porque el correo no se
 * pudo encolar).
 */
async function safeEnqueue(fn: () => Promise<unknown>): Promise<void> {
	try {
		await fn();
	} catch (error) {
		logError(`[email] enqueue failed: ${error}`);
	}
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
		(event) =>
			safeEnqueue(async () => {
				const appName = await resolveAppName();
				await enqueueEmail({
					to: event.email,
					...verifyEmailTemplate({
						firstName: event.firstName,
						verificationUrl: event.verificationUrl,
						lang: event.lang,
						appName,
					}),
				});
			}),
	);

	eventBus.subscribe<PasswordResetRequestedEvent>(
		EMAIL_EVENTS.PASSWORD_RESET_REQUESTED,
		(event) =>
			safeEnqueue(async () => {
				const appName = await resolveAppName();
				await enqueueEmail({
					to: event.email,
					...passwordResetTemplate({
						firstName: event.firstName,
						resetUrl: event.resetUrl,
						lang: event.lang,
						appName,
					}),
				});
			}),
	);

	eventBus.subscribe<EmailVerifiedEvent>(EMAIL_EVENTS.EMAIL_VERIFIED, (event) =>
		safeEnqueue(async () => {
			const appName = await resolveAppName();
			await enqueueEmail({
				to: event.email,
				...welcomeEmailTemplate({
					firstName: event.firstName,
					lang: event.lang,
					appName,
				}),
			});
		}),
	);

	eventBus.subscribe<FormSubmissionReceivedEvent>(
		EMAIL_EVENTS.FORM_SUBMISSION_RECEIVED,
		(event) =>
			safeEnqueue(async () => {
				const appName = await resolveAppName();
				const email = formSubmissionReceivedTemplate({
					formTitle: event.formTitle,
					submissionData: event.submissionData,
					lang: event.lang,
					appName,
				});
				// Una dirección que falle al encolar no debe bloquear a las demás.
				await Promise.allSettled(
					event.recipients.map((to) => enqueueEmail({ to, ...email })),
				);
			}),
	);
}
