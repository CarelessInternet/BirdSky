import { z } from 'zod';

export const quoteSchema = z.object({
	content: z
		.string()
		.min(1, { error: 'Quote must not be empty.' })
		.max(2000, { error: 'Quote must not be longer than 2000 characters.' }),
	id: z.uuidv7(),
});

export type QuoteSchema = z.infer<typeof quoteSchema>;
