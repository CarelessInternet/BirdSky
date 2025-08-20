'use client';

import { useMutation } from '@tanstack/react-query';
import { repostAction } from './postRepost';
import { Button } from '../../ui/button';
import { Loader, Repeat2 } from 'lucide-react';
import type { PostReposts } from '../types';
import type { Session } from '~/lib/auth/client';
import { post } from '~/lib/database/schema';
import { useState } from 'react';
import { getQueryClient } from '~/lib/query';

export default function PostRepost({
	id,
	isRepost,
	reposts: serverReposts,
	userId,
}: {
	id: typeof post.$inferSelect.id;
	isRepost: boolean;
	reposts: PostReposts;
	userId?: Session['user']['id'];
}) {
	const [hasUserReposted, setHasUserReposted] = useState(serverReposts.some((repost) => repost.author.id === userId));
	const [reposts, setReposts] = useState(serverReposts.length);

	const toggleRepost = () => {
		setHasUserReposted((reposted) => !reposted);
		setReposts((amount) => amount + (hasUserReposted ? -1 : 1));
	};

	const queryClient = getQueryClient();
	const mutation = useMutation({
		mutationFn: repostAction,
		onMutate: toggleRepost,
		onSuccess: (newReposts) => setReposts(newReposts),
		onError: toggleRepost,
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['post-reposts', id] }),
	});

	// TODO: allow content to be written or just repost with no content.

	return (
		<Button
			variant="ghost"
			size="lg"
			className={'hover:text-sky-500 ' + (hasUserReposted ? 'text-cyan-500' : '')}
			onClick={() => mutation.mutate(id)}
			disabled={
				// TODO: for now we temporarily don't allow reposting a repost.
				!userId || mutation.isPending || isRepost
			}
		>
			{mutation.isPending ? (
				<Loader className="size-5 animate-spin" />
			) : (
				<Repeat2 className={'size-5 ' + (hasUserReposted ? 'text-cyan-500' : '')} />
			)}
			{reposts}
		</Button>
	);
}
