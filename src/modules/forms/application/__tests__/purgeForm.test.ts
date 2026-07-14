import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/forms/infrastructure/FormModel', () => ({
	default: { findOne: vi.fn(), deleteOne: vi.fn() },
}));
vi.mock('@Modules/forms/infrastructure/FormSubmissionModel', () => ({
	default: { deleteMany: vi.fn() },
}));

import { purgeForm } from '@Modules/forms/application/purgeForm';
import FormModel from '@Modules/forms/infrastructure/FormModel';
import FormSubmissionModel from '@Modules/forms/infrastructure/FormSubmissionModel';

describe('purgeForm', () => {
	it('throws when the form is not in trash', async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(purgeForm('form-1')).rejects.toThrow();
		expect(FormModel.deleteOne).not.toHaveBeenCalled();
		expect(FormSubmissionModel.deleteMany).not.toHaveBeenCalled();
	});

	it('deletes the form and cascades to its submissions', async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'form-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(FormModel.deleteOne).mockResolvedValue({} as never);
		vi.mocked(FormSubmissionModel.deleteMany).mockResolvedValue({} as never);

		const result = await purgeForm('form-1');

		expect(FormModel.deleteOne).toHaveBeenCalledWith({ id: 'form-1' });
		expect(FormSubmissionModel.deleteMany).toHaveBeenCalledWith({
			formId: 'form-1',
		});
		expect(result).not.toHaveProperty('_id');
	});
});
