export abstract class DomainEvent {
	readonly occurredAt: Date;

	constructor() {
		this.occurredAt = new Date();
	}

	abstract get eventName(): string;
}

type EventHandler<T extends DomainEvent> = (event: T) => Promise<void> | void;

export interface IEventBus {
	publish(event: DomainEvent): Promise<void>;
	subscribe<T extends DomainEvent>(
		eventName: string,
		handler: EventHandler<T>,
	): void;
}

class InMemoryEventBus implements IEventBus {
	private readonly handlers = new Map<string, EventHandler<DomainEvent>[]>();

	subscribe<T extends DomainEvent>(
		eventName: string,
		handler: EventHandler<T>,
	): void {
		const existing = this.handlers.get(eventName) ?? [];
		this.handlers.set(eventName, [
			...existing,
			handler as EventHandler<DomainEvent>,
		]);
	}

	async publish(event: DomainEvent): Promise<void> {
		const handlers = this.handlers.get(event.eventName) ?? [];
		await Promise.all(
			handlers.map((handler) => Promise.resolve(handler(event))),
		);
	}
}

export const eventBus: IEventBus = new InMemoryEventBus();
