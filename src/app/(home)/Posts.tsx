import { database } from '~/lib/database/connection';
import { reply } from '~/lib/database/schema';
import Post from '~/components/post/Post';

export default async function Posts() {
	const posts = await database.query.post.findMany({
		columns: { content: true, createdAt: true, id: true },
		with: {
			author: { columns: { id: true, image: true, name: true, verified: true } },
			likes: { columns: { id: true, userId: true } },
			originalPost: { columns: { content: true, createdAt: true } },
			reposts: { with: { author: { columns: { id: true, image: true, name: true } } } },
		},
		extras: (post, { sql }) => ({
			// Aggregates are currently not supported in "extras"...
			// https://orm.drizzle.team/docs/rqb#include-custom-fields
			// replyCount: sql<number>`SELECT ${count()} FROM ${reply} WHERE ${eq(reply.postId, post.id)}`.as('reply_count'),
			// Using different tables is broken when using "extras".
			// https://github.com/drizzle-team/drizzle-orm/issues/3564
			replyCount: sql<number>`(SELECT count(*) FROM ${reply} WHERE "reply"."post_id" = ${post.id})`.as('reply_count'),
		}),
		// extras: (post) => ({
		// 	// The method below does not work because it's bugged.
		//	// https://github.com/drizzle-team/drizzle-orm/issues/3493
		// 	replyCount: database.$count(reply, eq(reply.postId, post.id)).as('reply_count'),
		// }),
		orderBy: (post, { desc }) => desc(post.id),
	});

	return (
		<div className="mx-auto max-w-2xl px-4 py-4">
			<div className="space-y-4">
				{posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
