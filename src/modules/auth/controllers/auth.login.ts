import { errorResponse, successResponse } from '@Helpers/responseStructure';
import { ControllerParams } from '@Types/controllerParams';

export const authLogin: ControllerParams = async (request, response) => {
	try {
		successResponse(response, {
			statusCode: 200,
			message: 'Login Successfully',
			code: 'success_login',
			data: [],
		});
	} catch (error) {
		errorResponse(response, {
			statusCode: 500,
			code: 'PROBLEM_LOGIN',
			message: 'Error',
			details: error,
		});
	}
};
