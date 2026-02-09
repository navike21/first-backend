import type { StatusRegister } from '@Constants/statusRegister';
import type { ClientType } from '@Constants/clientType';
import type { ClientIndustry } from '@Constants/clientIndustry';
import type { CountryISO2 } from '@Constants/countryISO2';
import type { TaxIdentifierType } from '@Constants/taxIdentifierType';

export interface ClientNoteSchema {
	message: string;
}

export interface ClientContactPersonSchema {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	position?: string;
	notes?: ClientNoteSchema[];
}

export interface ClientSchema {
	id?: string;
	clientType: ClientType;
	companyInformation: {
		businessName: string;
		industry: ClientIndustry;
		website?: string;
	};
	brandingInformation?: {
		logoUrl: string;
	};
	contactPersons: ClientContactPersonSchema[];
	contactInformation: {
		email: string;
		phoneNumber?: string;
		address?: string;
	};
	taxInformation?: {
		country: CountryISO2;
		typeInformation: TaxIdentifierType;
		value: string;
	};
	socialMediaLinks?: {
		facebook?: string;
		linkedIn?: string;
		website?: string;
	};
	status: StatusRegister;
}
