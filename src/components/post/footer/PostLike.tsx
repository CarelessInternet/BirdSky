'use client';

import { Heart, Loader } from 'lucide-react';
import { Button } from '../../ui/button';
import { useMutation } from '@tanstack/react-query';
import { givePostLike } from './postLike';
import type { like } from '~/lib/database/schema';
import { getQueryClient } from '~/lib/query';
import { useState } from 'react';
import type { auth } from '~/lib/auth/server';
import type { PostLikes } from '../types';

export default function PostLike({
	id,
	likes: serverLikes,
	userId,
}: {
	id: typeof like.$inferSelect.postId;
	likes: PostLikes;
	userId?: typeof auth.$Infer.Session.user.id;
}) {
	const [hasUserLiked, setHasUserLiked] = useState(serverLikes.some((like) => like.author.id === userId));
	const [likes, setLikes] = useState(serverLikes.length);

	const toggleLike = () => {
		setHasUserLiked((liked) => !liked);
		setLikes((amount) => amount + (hasUserLiked ? -1 : 1));
	};

	const queryClient = getQueryClient();
	const mutation = useMutation({
		mutationFn: givePostLike,
		onMutate: toggleLike,
		onSuccess: (newLikes) => setLikes(newLikes),
		onError: toggleLike,
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['post-likes', id] }),
	});

	return (
		<Button
			variant="ghost"
			size="lg"
			className={'hover:text-rose-500' + (hasUserLiked ? ' text-red-500' : '')}
			onClick={() => mutation.mutate(id)}
			disabled={!userId || mutation.isPending}
		>
			{mutation.isPending ? (
				<Loader className="size-5 animate-spin" />
			) : (
				<Heart className={'size-5' + (hasUserLiked ? ' fill-red-500' : '')} />
			)}
			{likes}
		</Button>
	);
}
