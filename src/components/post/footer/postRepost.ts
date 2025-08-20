'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '~/lib/auth/server';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';

export async function postReposts(originalPostId: typeof post.$inferSelect.id) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error('Not authenticated.');
	}

	return database.query.post.findMany({
		columns: { id: true },
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
