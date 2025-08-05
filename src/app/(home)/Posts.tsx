'use client';

import Post from '~/components/post/Post';
import { fetchPostsOptions } from './fetchPostsOptions';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Fragment, useEffect } from 'react';
import { useInfiniteScroll } from '~/components/useInfiniteScroll';

export default function Posts() {
	const { data, fetchNextPage } = useSuspenseInfiniteQuery(fetchPostsOptions);
	const { inView, ref } = useInfiniteScroll<HTMLInputElement>();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView]);

	return (
		<div className="mx-auto max-w-2xl px-4 py-4">
			<div className="space-y-8">
				{data.pages.map((page) => (
					<Fragment key={page.nextCursor}>
						{page.data.map((post) => (
							<Post key={post.id} post={post} />
						))}
					</Fragment>
				))}
				<input type="button" className="size-0" ref={ref} />
			</div>
		</div>
	);
}
