import { parseISO, isValid } from 'date-fns';

export const isValidISODateString = (value: string): boolean => {
	const parsedDate = parseISO(value);
	return isValid(parsedDate);
};
