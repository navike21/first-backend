import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';

describe('PortfolioModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(PortfolioModel).toBeDefined();
		expect(typeof PortfolioModel.find).toBe('function');
		expect(typeof PortfolioModel.findOne).toBe('function');
		expect(typeof PortfolioModel.create).toBe('function');
	});
});
