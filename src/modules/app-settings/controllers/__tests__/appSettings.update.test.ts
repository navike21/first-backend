import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockUpdateAppSettings, mockSuccessResponse } = vi.hoisted(() => ({
	mockUpdateAppSettings: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/app-settings/application/updateAppSettings', () => ({
	updateAppSettings: mockUpdateAppSettings,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { appSettingsUpdateController } from '../appSettings.update';

function run(body: object = {}): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		appSettingsUpdateController(
			{ body } as unknown as Request,
			{ locals: {} } as unknown as Response,
			next,
		);
	});
}

describe('appSettingsUpdateController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls updateAppSettings and returns 200 on valid body', async () => {
		const updated = { general: { appName: 'Updated' } };
		mockUpdateAppSettings.mockResolvedValue({ data: updated, warnings: [] });

		await run({ general: { appName: 'Updated' } });

		expect(mockUpdateAppSettings).toHaveBeenCalledOnce();
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				statusCode: 200,
				message: 'SUCCESS_APP_SETTINGS_UPDATED',
				ns: 'app-settings',
				data: updated,
			}),
		);
	});

	it('calls next with VALIDATION_SCHEMA_ERROR when body is invalid', async () => {
		await expect(run({})).rejects.toMatchObject({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
		});
		expect(mockUpdateAppSettings).not.toHaveBeenCalled();
	});

	it('passes error to next when updateAppSettings rejects', async () => {
		mockUpdateAppSettings.mockRejectedValue(new Error('db error'));
		await expect(run({ general: { appName: 'X' } })).rejects.toThrow(
			'db error',
		);
	});
});
