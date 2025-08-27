'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '~/lib/auth/server';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';
import { errors, rootError, type ActionState } from '~/lib/form';
import { quoteSchema, type QuoteSchema } from './formOptions';
import type { PostReposts } from '../types';

export async function postReposts(originalPostId: typeof post.$inferSelect.id): Promise<PostReposts> {
	return database.query.post.findMany({
		columns: { createdAt: true, id: true, userAgent: true },
		with: { author: { columns: { id: true, image: true, name: true, verified: true } } },
		where: (post, { eq }) => eq(post.originalPostId, originalPostId),
		orderBy: (post, { desc }) => desc(post.createdAt),
	});
}

export async function repostAction(originalPostId: typeof post.$inferSelect.id) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error('Not authenticated.');
	}

	// TODO: allow reposting a repost.
	const userReposted = await database.$count(
		post,
		and(eq(post.originalPostId, originalPostId), eq(post.userId, session.user.id)),
	);

	if (userReposted > 0) {
		await database.delete(post).where(and(eq(post.originalPostId, originalPostId), eq(post.userId, session.user.id)));
	} else {
		await database
			.insert(post)
			.values({ userId: session.user.id, originalPostId, userAgent: session.session.userAgent });
		// .onConflictDoUpdate({
		// 	set: { originalPostId: null },
		// 	target: post.originalPostId,
		// });
	}

	revalidatePath('/');
	return database.$count(post, eq(post.originalPostId, originalPostId));
}

export async function quoteAction(_: ActionState<QuoteSchema>, formData: FormData): Promise<ActionState<QuoteSchema>> {
	const fields = { content: formData.get('content') || '', id: formData.get('id') || '' };
	const validation = quoteSchema.safeParse(fields);

	if (!validation.success) {
		return {
			success: validation.success,
			errors: errors(validation.error),
			values: { content: fields.content.toString(), id: fields.id.toString() },
		};
	}

	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return rootError({ error: 'Not authenticated.', values: validation.data });
	}

	// TODO: allow reposting a repost.
	const userReposted = await database.$count(
		post,
		and(eq(post.originalPostId, validation.data.id), eq(post.userId, session.user.id)),
	);

	if (userReposted > 0) {
		return rootError({ error: 'This post has already been quoted by you.', values: validation.data });
	}

	try {
		await database.insert(post).values({
			userId: session.user.id,
			originalPostId: validation.data.id,
			content: validation.data.content,
			userAgent: session.session.userAgent,
		});
	} catch {
		return rootError({ error: 'A server-side error occurred while creating the post.', values: validation.data });
	}

	revalidatePath('/');

	return { success: true, values: validation.data };
}
