// todo: show posts
// todo: add a loading state for the page

export const experimental_ppr = true;

import { auth } from '~/lib/auth/server';
import CreatePost from './CreatePost';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Posts from './Posts';

export default async function Page() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<main>
			{session && <CreatePost />}
			<p>Other content</p>
			<Suspense fallback={<div>Loading...</div>}>
				<Posts />
			</Suspense>
		</main>
	);
}
