import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';

describe('CollaboratorModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CollaboratorModel).toBeDefined();
		expect(typeof CollaboratorModel.find).toBe('function');
		expect(typeof CollaboratorModel.findOne).toBe('function');
		expect(typeof CollaboratorModel.create).toBe('function');
	});
});
