import { z } from 'zod';

export const schema = z.object({
	content: z
		.string()
		.min(1, { error: 'Post must not be empty.' })
		.max(2000, { error: 'Post must not be longer than 2000 characters.' }),
});

export type Schema = z.infer<typeof schema>;
