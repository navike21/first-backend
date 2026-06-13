import { DomainEvent } from '@Shared/infrastructure/EventBus';

/**
 * Email-triggering domain events. Defined in `shared` so producers (users, auth)
 * publish them without importing the notifications-email module, and the email
 * subscriber consumes them without importing the producers — no coupling either way.
 */
export const EMAIL_EVENTS = {
	USER_REGISTERED: 'user.registered',
	PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',
	EMAIL_VERIFIED: 'auth.email_verified',
} as const;

export class UserRegisteredEvent extends DomainEvent {
	constructor(
		public readonly email: string,
		public readonly firstName: string,
		public readonly verificationUrl: string,
		public readonly lang: string,
	) {
		super();
	}

	get eventName(): string {
		return EMAIL_EVENTS.USER_REGISTERED;
	}
}

export class PasswordResetRequestedEvent extends DomainEvent {
	constructor(
		public readonly email: string,
		public readonly firstName: string,
		public readonly resetUrl: string,
		public readonly lang: string,
	) {
		super();
	}

	get eventName(): string {
		return EMAIL_EVENTS.PASSWORD_RESET_REQUESTED;
	}
}

export class EmailVerifiedEvent extends DomainEvent {
	constructor(
		public readonly email: string,
		public readonly firstName: string,
		public readonly lang: string,
	) {
		super();
	}

	get eventName(): string {
		return EMAIL_EVENTS.EMAIL_VERIFIED;
	}
}
