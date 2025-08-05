// todo (wip): show posts and functionality
// todo: if no posts, say so.
// todo: add a loading state for the page

export const experimental_ppr = true;

import { auth } from '~/lib/auth/server';
import CreatePost from './CreatePost';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Posts from './Posts';
import { getQueryClient } from '~/lib/query';
import { fetchPostsOptions } from './fetchPostsOptions';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function Page() {
	const session = await auth.api.getSession({ headers: await headers() });
	const queryClient = getQueryClient();
	void queryClient.prefetchInfiniteQuery(fetchPostsOptions);

	return (
		<main>
			{session && <CreatePost />}
			<p>Other content</p>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<div>Loading...</div>}>
					<Posts />
				</Suspense>
			</HydrationBoundary>
		</main>
	);
}
