'use server';

import { ActionState, schema } from './formOptions';
import { revalidatePath } from 'next/cache';
import { auth } from '~/lib/auth/server';
import { headers } from 'next/headers';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';
import { errors, rootError } from '~/lib/form';

export default async function createPost(initialState: ActionState, formData: FormData): Promise<ActionState> {
	const fields = { content: formData.get('content') || '' };
	const validation = schema.safeParse(fields);

	if (!validation.success) {
		return {
			success: validation.success,
			errors: errors(validation.error),
			values: { content: fields.content.toString() },
		};
	}

	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return rootError({ error: 'Not authenticated.', values: validation.data });
	}

	try {
		await database.insert(post).values({ authorId: session.user.id, content: validation.data.content });
	} catch {
		return rootError({ error: 'An unknown server-side error occurred.', values: validation.data });
	}

	revalidatePath('/');

	return { success: true, values: validation.data };
}
