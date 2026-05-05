import { describe, it, expect, vi } from 'vitest';
import { SySTEM_ENVIRONMENT } from '@Constants/systemEnvironment';

vi.mock('@Constants/environments', () => ({
	default: { ENVIRONMENT: SySTEM_ENVIRONMENT.DEVELOPMENT },
	ENV: { ENVIRONMENT: SySTEM_ENVIRONMENT.DEVELOPMENT },
}));

import { isDevelopmentEnvironment } from '@Helpers/systemEnvironment';

describe('isDevelopmentEnvironment', () => {
	it('returns isDevelopment true when ENVIRONMENT is development', () => {
		// Arrange & Act
		const { isDevelopment } = isDevelopmentEnvironment();

		// Assert
		expect(isDevelopment).toBe(true);
	});
});
