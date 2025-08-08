// TODO: make the code better

'use client';

import { Heart, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { givePostLike } from './postLike';
import type { like } from '~/lib/database/schema';
import { getQueryClient } from '~/lib/query';
import { useState } from 'react';

export default function PostLike({
	hasUserLiked: serverHasUserLiked,
	id,
	likes: serverLikes,
}: {
	hasUserLiked: boolean;
	id: typeof like.$inferSelect.postId;
	likes: number;
}) {
	const [hasUserLiked, setHasUserLiked] = useState(serverHasUserLiked);
	const [likes, setLikes] = useState(serverLikes);
	const queryClient = getQueryClient();
	const mutation = useMutation({
		mutationFn: givePostLike,
		onMutate: () => {
			setHasUserLiked((liked) => !liked);
			setLikes((amount) => amount + (hasUserLiked ? -1 : 1));
		},
		onSuccess: (newLikes) => {
			setLikes(newLikes);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['post-likes'] }),
	});

	return (
		<Button
			variant="ghost"
			size="lg"
			className={'hover:text-rose-500' + (hasUserLiked ? ' text-red-500' : '')}
			onClick={() => {
				mutation.mutate(id);
			}}
			disabled={mutation.isPending}
		>
			{mutation.isPending ? <Loader className="size-5 animate-spin" /> : <Heart className="size-5" />}
			{likes}
		</Button>
	);
}
