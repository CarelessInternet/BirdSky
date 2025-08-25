'use server';

import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '~/lib/auth/server';
import { database } from '~/lib/database/connection';
import { like } from '~/lib/database/schema';
import type { PostLikes } from '../types';

export async function postLikes(postId: typeof like.$inferSelect.postId): Promise<PostLikes> {
	return database.query.like.findMany({
		columns: { createdAt: true, id: true },
		with: { author: { columns: { id: true, image: true, name: true, verified: true } } },
		where: (like, { eq }) => eq(like.postId, postId),
		orderBy: (like, { desc }) => desc(like.createdAt),
	});
}

export async function postAction(postId: typeof like.$inferSelect.postId) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error('Not authenticated.');
	}

	const [authorLike] = await database
		.select()
		.from(like)
		.where(and(eq(like.postId, postId), eq(like.userId, session.user.id)));

	if (authorLike) {
		await database.delete(like).where(eq(like.id, authorLike.id));
	} else {
		await database.insert(like).values({ postId, userId: session.user.id, userAgent: session.session.userAgent });
	}

	return database.$count(like, eq(like.postId, postId));
}
