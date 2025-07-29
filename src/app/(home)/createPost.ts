'use server';

import { ServerValidateError, createServerValidate } from '@tanstack/react-form/nextjs';
import { formOptions, schema } from './formOptions';
import { revalidatePath } from 'next/cache';
import { auth } from '~/lib/auth/server';
import { headers } from 'next/headers';
import { showServerErrorInForm } from '~/lib/form';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';
import { z } from 'zod';

const serverValidate = createServerValidate({
	...formOptions,
	onServerValidate: schema,
});

export default async function createPost(_: unknown, formData: FormData) {
	let success = false;

	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session) {
			return showServerErrorInForm('Not authenticated.');
		}

		const { content } = await serverValidate(formData);
		await database.insert(post).values({ authorId: session.user.id, content });

		success = true;
	} catch (error) {
		if (error instanceof ServerValidateError) {
			return error.formState;
		}

		console.error('Error creating post:', error);
	}

	if (success) {
		revalidatePath('/');
	}
}
