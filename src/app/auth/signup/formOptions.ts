import { z } from 'zod';

export const schema = z.object({
	name: z
		.string()
		.min(1, { error: 'Name must not be empty.' })
		.max(30, { error: 'Name must not be longer than 30 characters.' }),
	email: z.email().min(1, { error: 'E-mail must not be empty.' }),
	password: z.string().min(8, { error: 'Password must be longer than 8 characters.' }),
	image: z.url({ protocol: /^https?$/, hostname: z.regexes.domain }).nullable(),
});

export type Schema = z.infer<typeof schema>;
