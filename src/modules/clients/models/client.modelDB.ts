import { Schema, model } from 'mongoose';
import { v6 as uuid } from 'uuid';

import { ACTIVE, STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { CLIENT_INDUSTRY_ARRAY } from '@Constants/clientIndustry';
import { CLIENT_TYPE_ARRAY } from '@Constants/clientType';
import { COUNTRY_ISO2_ARRAY } from '@Constants/countryISO2';
import { TAX_IDENTIFIER_TYPE_ARRAY } from '@Constants/taxIdentifierType';

import { urlValidate } from '@Helpers/urlValidate';
import { emailValidate } from '@Helpers/emailValidate';

import type { ClientSchema } from '../types/client.schema';

const ClientModel = new Schema<ClientSchema>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
			default: () => uuid(),
		},
		clientType: {
			type: String,
			required: true,
			enum: CLIENT_TYPE_ARRAY,
		},
		companyInformation: {
			required: true,
			type: {
				businessName: {
					type: String,
					required: true,
					maxLength: 200,
					minLength: 2,
					unique: true,
				},
				industry: {
					type: String,
					required: true,
					enum: CLIENT_INDUSTRY_ARRAY,
				},
				website: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
			},
		},
		brandingInformation: {
			required: false,
			type: {
				logoUrl: {
					type: String,
					required: function (this: ClientSchema) {
						return this.brandingInformation != null;
					},
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
			},
		},
		contactPersons: {
			type: [
				{
					firstName: {
						type: String,
						required: true,
						maxLength: 50,
						minLength: 1,
					},
					lastName: {
						type: String,
						required: true,
						maxLength: 100,
						minLength: 1,
					},
					email: {
						type: String,
						required: true,
						validate: {
							validator: (value: string) => emailValidate(value),
						},
					},
					phoneNumber: {
						type: String,
						required: false,
						minLength: 9,
						maxLength: 15,
					},
					position: {
						type: String,
						required: false,
						maxLength: 120,
					},
					notes: {
						type: [
							{
								message: {
									type: String,
									required: true,
									minLength: 2,
									maxLength: 500,
								},
							},
						],
					},
				},
			],
			required: true,
		},
		contactInformation: {
			required: true,
			type: {
				email: {
					type: String,
					required: true,
					validate: {
						validator: (value: string) => emailValidate(value),
					},
				},
				phoneNumber: {
					type: String,
					required: false,
					minLength: 9,
					maxLength: 15,
				},
				address: {
					type: String,
					required: false,
					maxLength: 300,
					minLength: 5,
				},
			},
		},
		taxInformation: {
			required: false,
			type: {
				country: {
					type: String,
					required: true,
					enum: COUNTRY_ISO2_ARRAY,
				},
				typeInformation: {
					type: String,
					required: true,
					enum: TAX_IDENTIFIER_TYPE_ARRAY,
				},
				value: {
					type: String,
					required: true,
					minLength: 4,
					maxLength: 30,
				},
			},
		},
		socialMediaLinks: {
			required: false,
			type: {
				facebook: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				linkedIn: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
				website: {
					type: String,
					required: false,
					validate: {
						validator: (value: string) => {
							if (!value) return true;
							return urlValidate(value);
						},
					},
				},
			},
		},
		status: {
			type: String,
			required: true,
			default: ACTIVE,
			enum: STATUS_REGISTER_ARRAY,
		},
	},
	{
		timestamps: true,
	},
);

export default model<ClientSchema>('Client', ClientModel);
