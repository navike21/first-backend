import { z } from 'zod';

export const emailValidate = (email: string): boolean =>
	z.email().safeParse(email).success;
