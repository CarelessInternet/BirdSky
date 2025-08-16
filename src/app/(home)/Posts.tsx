'use client';

import Post from '~/components/post/Post';
import { fetchPostsOptions } from './fetchPostsOptions';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Fragment, useEffect } from 'react';
import useInView from '~/components/useInView';
import { Card, CardContent } from '~/components/ui/card';
import { ArrowDown, FileText, LogIn } from 'lucide-react';
import CreatePost from './CreatePost';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import type { Session } from '~/lib/auth/client';

export default function Posts({ userId }: { userId?: Session['user']['id'] }) {
	const { data, fetchNextPage } = useSuspenseInfiniteQuery(fetchPostsOptions);
	const { inView, ref } = useInView<HTMLInputElement>();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView]);

	const hasPosts = data.pages.some((page) => page.data.length > 0);

	return (
		<>
			{hasPosts ? (
				data.pages.map((page) => (
					<Fragment key={page.nextCursor}>
						{page.data.map((post) => (
							<Post key={post.id} post={post} userId={userId} />
						))}
					</Fragment>
				))
			) : (
				<Card className="mx-auto w-full max-w-md">
					<CardContent className="flex flex-col items-center justify-center p-8 text-center">
						<div className="bg-muted mb-4 rounded-full p-4">
							<FileText className="text-muted-foreground h-8 w-8" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">No Posts!</h3>
						<p className="text-muted-foreground mb-6 text-sm">
							There is not a single post created yet. Let&apos;s change that!
						</p>
						<ArrowDown className="ring-primary/50 text-primary mb-4 size-10 animate-bounce rounded-full ring-3" />
						{userId ? (
							<CreatePost />
						) : (
							<Button asChild>
								<Link href="/auth/signin">
									<LogIn />
									Sign in
								</Link>
							</Button>
						)}
					</CardContent>
				</Card>
			)}
			<input type="button" className="size-0" ref={ref} />
		</>
	);
}
