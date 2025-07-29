// todo: create a post button + modal if logged in.
// todo: show posts
// todo: add a loading state for the page

import { auth } from '~/lib/auth/server';
import CreatePost from './CreatePost';
import { headers } from 'next/headers';
import { database } from '~/lib/database/connection';
import { post } from '~/lib/database/schema';

export default async function Page() {
	const session = await auth.api.getSession({ headers: await headers() });
	const posts = await database.select().from(post);

	return (
		<main>
			{session && <CreatePost />}
			<p>Other content</p>
			{posts.map((post) => (
				<p key={post.id}>
					Post by {post.authorId}: {post.content}
				</p>
			))}
		</main>
	);
}
