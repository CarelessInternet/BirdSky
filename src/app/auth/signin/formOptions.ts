import { z } from 'zod';

export const schema = z.object({
	email: z.email().min(1, { error: 'E-mail must not be empty.' }),
	password: z.string().min(8, { error: 'Password must be longer than 8 characters.' }),
});

export type Schema = z.infer<typeof schema>;
