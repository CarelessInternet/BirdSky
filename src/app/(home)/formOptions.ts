import { formOptions as form } from '@tanstack/react-form/nextjs';
import { z } from 'zod';

export const schema = z.object({
	content: z.string({ error: 'Post content must be between 0 and 2000 characters long.' }).min(1).max(2000),
});

export const formOptions = form({
	defaultValues: {
		content: '# Be free!\n\n![BirdSky Logo](birdsky.png)',
	} satisfies z.infer<typeof schema>,
	validators: {
		onChange: schema,
	},
});
