import { parseISO, isValid } from 'date-fns';

export const isValidISODateString = (value: string | undefined): boolean => {
	if (!value || typeof value !== 'string') {
		return false;
	}

	const parsedDate = parseISO(value);
	return isValid(parsedDate);
};
