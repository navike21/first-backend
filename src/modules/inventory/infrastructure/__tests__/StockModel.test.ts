import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import StockModel from '@Modules/inventory/infrastructure/StockModel';

describe('StockModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(StockModel).toBeDefined();
		expect(typeof StockModel.find).toBe('function');
		expect(typeof StockModel.findOneAndUpdate).toBe('function');
	});
});
