'use client';

import Post from '~/components/post/Post';
import { fetchPostsOptions } from './fetchPosts';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function Posts() {
	const { data: posts } = useSuspenseQuery(fetchPostsOptions);

	return (
		<div className="mx-auto max-w-2xl px-4 py-4">
			<div className="space-y-8">
				{posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
