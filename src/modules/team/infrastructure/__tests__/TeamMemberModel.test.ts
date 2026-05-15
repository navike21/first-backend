import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import TeamMemberModel from '@Modules/team/infrastructure/TeamMemberModel';

describe('TeamMemberModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(TeamMemberModel).toBeDefined();
		expect(typeof TeamMemberModel.find).toBe('function');
		expect(typeof TeamMemberModel.findOne).toBe('function');
		expect(typeof TeamMemberModel.create).toBe('function');
	});
});
