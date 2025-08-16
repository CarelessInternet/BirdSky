'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '~/lib/auth/server';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';

export async function repostAction(originalPostId: typeof post.$inferSelect.id) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error('Not authenticated.');
	}

	await database
		.insert(post)
		.values({ userId: session.user.id, originalPostId, userAgent: session.session.userAgent })
		.onConflictDoUpdate({
			set: { originalPostId: null },
			target: post.originalPostId,
		});

	revalidatePath('/');
}
