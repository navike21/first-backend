import countries from './countries.json';
import pe from './pe.json';

export interface Country {
	code: string;
	code3: string;
	name: string;
	nameEn: string;
	flag: string;
	dialCode: string;
	hasDivisions: boolean;
	/** Ordered division level labels (e.g. Departamento/Provincia/Distrito). */
	divisionLevels?: string[];
}

export interface DivisionNode {
	code: string;
	name: string;
	children?: DivisionNode[];
}

export interface CountryDivisions {
	country: string;
	source: string;
	levels: string[];
	divisions: DivisionNode[];
}

export const COUNTRIES = countries as Country[];

/** Hierarchical administrative divisions per country (variable depth). */
export const DIVISIONS_BY_COUNTRY: Record<string, CountryDivisions> = {
	PE: pe as unknown as CountryDivisions,
};
