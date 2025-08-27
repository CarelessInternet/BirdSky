'use server';

import { database } from '~/lib/database/connection';
import { type commonUserContentFields, post, reply, type user } from '~/lib/database/schema';
import type { InfiniteQueryResult } from '~/lib/query';

export default async function fetchPosts({ pageParam: offset }: { pageParam: number }) {
	const PAGE_LIMIT = 5;
	const authorColumns = { createdAt: true, id: true, image: true, name: true, verified: true } as Record<
		keyof typeof user.$inferSelect,
		true
	>;
	const interactionsColumns = { createdAt: true, id: true, userAgent: true } as Record<
		keyof typeof commonUserContentFields,
		true
	>;
	const postColumns = { content: true, ...interactionsColumns } as Record<keyof typeof post, true>;

	const data = await database.query.post.findMany({
		columns: postColumns,
		with: {
			author: { columns: authorColumns },
			likes: { columns: interactionsColumns, with: { author: { columns: authorColumns } } },
			originalPost: {
				columns: postColumns,
				with: { author: { columns: authorColumns } },
			},
			reposts: {
				columns: interactionsColumns,
				with: { author: { columns: authorColumns } },
			},
		},
		// _post is bugged when trying to select from that table.
		extras: (_post, { sql }) => ({
			// Aggregates are currently not supported in "extras"...
			// https://orm.drizzle.team/docs/rqb#include-custom-fields
			// replyCount: sql<number>`SELECT ${count()} FROM ${reply} WHERE ${eq(reply.postId, post.id)}`.as('reply_count'),
			// Using different tables is broken when using "extras".
			// https://github.com/drizzle-team/drizzle-orm/issues/3564
			replyCount: sql<number>`(SELECT cast(count(*) as int) FROM ${reply} WHERE "reply"."post_id" = ${post.id})`.as(
				'reply_count',
			),
			repostCount:
				sql<number>`(SELECT cast(count(*) as int) FROM ${post} WHERE ${post.originalPostId} = ${post.id})`.as(
					'repost_count',
				),
		}),
		// extras: (post) => ({
		// 	// The method below does not work because it's bugged.
		//	// https://github.com/drizzle-team/drizzle-orm/issues/3493
		// 	replyCount: database.$count(reply, eq(reply.postId, post.id)).as('reply_count'),
		// }),
		orderBy: (post, { desc }) => desc(post.id),
		limit: PAGE_LIMIT,
		offset,
	});

	return {
		data,
		previousCursor: offset > 0 ? Math.max(0, offset - PAGE_LIMIT) : null,
		nextCursor: data.length === PAGE_LIMIT ? offset + PAGE_LIMIT : null,
	} satisfies InfiniteQueryResult<typeof data>;
}

export type PostData = Awaited<ReturnType<typeof fetchPosts>>['data'][number];
