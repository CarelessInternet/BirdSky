'use server';

import { type Schema, schema } from './formOptions';
import { revalidatePath } from 'next/cache';
import { auth } from '~/lib/auth/server';
import { headers } from 'next/headers';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';
import { type ActionState, errors, rootError } from '~/lib/form';

export default async function createPost(_: ActionState<Schema>, formData: FormData): Promise<ActionState<Schema>> {
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
		await database
			.insert(post)
			.values({ userId: session.user.id, content: validation.data.content, userAgent: session.session.userAgent });
	} catch {
		return rootError({ error: 'A server-side error occurred while creating the post.', values: validation.data });
	}

	revalidatePath('/');
	return { success: true, values: validation.data };
}
