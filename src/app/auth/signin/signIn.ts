'use server';

import { errors, rootError, type ActionState } from '~/lib/form';
import { schema, type Schema } from './formOptions';
import { auth } from '~/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function signIn(_: ActionState<Schema>, formData: FormData): Promise<ActionState<Schema>> {
	const fields = {
		email: formData.get('email') || '',
		password: formData.get('password') || '',
	};
	const validation = schema.safeParse(fields);

	if (!validation.success) {
		return {
			success: validation.success,
			errors: errors(validation.error),
			values: { email: fields.email.toString(), password: fields.password.toString() },
		};
	}

	try {
		await auth.api.signInEmail({ body: { rememberMe: true, ...validation.data } });
	} catch (error) {
		return rootError({ error: (error as Error).message, values: validation.data });
	}

	redirect('/');
}
