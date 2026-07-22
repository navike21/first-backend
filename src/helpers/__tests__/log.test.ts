import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	default: {},
	ENV: {},
}));

describe('logInfo', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('calls console.log with INFO prefix when in development', async () => {
		// Arrange
		vi.doMock('@Helpers/systemEnvironment', () => ({
			isDevelopmentEnvironment: () => ({ isDevelopment: true }),
		}));
		const { logInfo } = await import('@Helpers/log');
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

		// Act
		logInfo('test message');

		// Assert
		expect(spy).toHaveBeenCalledWith('INFO: test message');
	});

	it('does not call console.log when not in development', async () => {
		// Arrange
		vi.doMock('@Helpers/systemEnvironment', () => ({
			isDevelopmentEnvironment: () => ({ isDevelopment: false }),
		}));
		const { logInfo } = await import('@Helpers/log');
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

		// Act
		logInfo('test message');

		// Assert
		expect(spy).not.toHaveBeenCalled();
	});

	it('serializes objects to JSON', async () => {
		// Arrange
		vi.doMock('@Helpers/systemEnvironment', () => ({
			isDevelopmentEnvironment: () => ({ isDevelopment: true }),
		}));
		const { logInfo } = await import('@Helpers/log');
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

		// Act
		logInfo({ key: 'value' });

		// Assert
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('"key": "value"'));
	});
});

describe('logError', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('calls console.error with ERROR prefix when in development', async () => {
		// Arrange
		vi.doMock('@Helpers/systemEnvironment', () => ({
			isDevelopmentEnvironment: () => ({ isDevelopment: true }),
		}));
		const { logError } = await import('@Helpers/log');
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Act
		logError('something went wrong');

		// Assert
		expect(spy).toHaveBeenCalledWith('ERROR: something went wrong');
	});

	// Unlike logInfo, errors must stay visible outside development — a
	// production crash with no log trail is undebuggable.
	it('still calls console.error when not in development', async () => {
		// Arrange
		vi.doMock('@Helpers/systemEnvironment', () => ({
			isDevelopmentEnvironment: () => ({ isDevelopment: false }),
		}));
		const { logError } = await import('@Helpers/log');
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Act
		logError('something went wrong');

		// Assert
		expect(spy).toHaveBeenCalledWith('ERROR: something went wrong');
	});

	it('serializes objects to JSON', async () => {
		// Arrange
		vi.doMock('@Helpers/systemEnvironment', () => ({
			isDevelopmentEnvironment: () => ({ isDevelopment: false }),
		}));
		const { logError } = await import('@Helpers/log');
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Act
		logError({ key: 'value' });

		// Assert
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('"key": "value"'));
	});
});
