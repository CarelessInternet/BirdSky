'use server';

import { database } from '../database/connection';
import { reply, post, like } from '../database/schema';

export default async function getPosts() {
	const posts = await database.query.post.findMany({
		columns: { content: true, createdAt: true, id: true },
		with: {
			author: { columns: { id: true, image: true, name: true, verified: true } },
			// likes: { columns: { id: true, userId: true } },
			originalPost: { columns: { content: true, createdAt: true } },
			// reposts: { with: { author: { columns: { id: true, image: true, name: true } } } },
		},
		// _post is bugged when trying to select from that table.
		extras: (_post, { sql }) => ({
			// Aggregates are currently not supported in "extras"...
			// https://orm.drizzle.team/docs/rqb#include-custom-fields
			// replyCount: sql<number>`SELECT ${count()} FROM ${reply} WHERE ${eq(reply.postId, post.id)}`.as('reply_count'),
			// Using different tables is broken when using "extras".
			// https://github.com/drizzle-team/drizzle-orm/issues/3564
			replyCount: sql<number>`(SELECT count(*) FROM ${reply} WHERE "reply"."post_id" = ${post.id})`.as('reply_count'),
			repostCount: sql<number>`(SELECT count(*) FROM ${post} WHERE ${post.originalPostId} = ${post.id})`.as(
				'repost_count',
			),
			likeCount: sql<number>`(SELECT count(*) FROM ${like} WHERE "like"."post_id" = ${post.id})`.as('like_count'),
		}),
		// extras: (post) => ({
		// 	// The method below does not work because it's bugged.
		//	// https://github.com/drizzle-team/drizzle-orm/issues/3493
		// 	replyCount: database.$count(reply, eq(reply.postId, post.id)).as('reply_count'),
		// }),
		orderBy: (post, { desc }) => desc(post.id),
	});

	return posts;
}
