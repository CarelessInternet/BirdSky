// todo (wip): show posts and functionality
// todo: add a proper loading state for the page

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
		<main className="mx-auto mt-4 w-full max-w-2xl px-4 py-4">
			<div className="space-y-16">
				{session && (
					<div className="flex justify-center">
						<CreatePost />
					</div>
				)}
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense fallback={<div>Loading...</div>}>
						<Posts userId={session?.user.id} />
					</Suspense>
				</HydrationBoundary>
			</div>
		</main>
	);
}
