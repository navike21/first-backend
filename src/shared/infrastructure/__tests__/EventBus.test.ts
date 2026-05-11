import { describe, it, expect, vi } from 'vitest';
import { DomainEvent, eventBus } from '@Shared/infrastructure/EventBus';

class TestEvent extends DomainEvent {
	constructor(public readonly payload: string) {
		super();
	}

	get eventName(): string {
		return 'test.event';
	}
}

class NeverSubscribedEvent extends DomainEvent {
	get eventName(): string {
		return 'never.subscribed.event';
	}
}

describe('DomainEvent', () => {
	it('sets occurredAt to the current time on construction', () => {
		// Arrange
		const before = new Date();

		// Act
		const event = new TestEvent('data');

		// Assert
		expect(event.occurredAt).toBeInstanceOf(Date);
		expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
	});
});

describe('InMemoryEventBus', () => {
	it('calls a subscribed handler when the matching event is published', async () => {
		// Arrange
		const handler = vi.fn();
		eventBus.subscribe('test.event', handler);

		// Act
		const event = new TestEvent('hello');
		await eventBus.publish(event);

		// Assert
		expect(handler).toHaveBeenCalledWith(event);
	});

	it('does not call a handler when publishing an event it has no subscription for', async () => {
		// Arrange
		const handler = vi.fn();
		eventBus.subscribe('other.event', handler);

		// Act — publish an event that has never been subscribed to in any test
		await eventBus.publish(new NeverSubscribedEvent());

		// Assert
		expect(handler).not.toHaveBeenCalled();
	});

	it('calls multiple handlers subscribed to the same event', async () => {
		// Arrange
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		eventBus.subscribe('multi.event', handler1);
		eventBus.subscribe('multi.event', handler2);

		// Act
		const event = new TestEvent('multi');
		await eventBus.publish({ ...event, eventName: 'multi.event' } as TestEvent);

		// Assert
		expect(handler1).toHaveBeenCalled();
		expect(handler2).toHaveBeenCalled();
	});
});
