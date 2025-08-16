// TODO

'use client';

import { useMutation } from '@tanstack/react-query';
import { repostAction } from './postRepost';
import { Button } from '../../ui/button';
import { Loader, Repeat2 } from 'lucide-react';
import type { PostReposts } from '../types';
import type { Session } from '~/lib/auth/client';
import { post } from '~/lib/database/schema';

export default function PostRepost({
	// id,
	reposts,
	// userId,
}: {
	id: typeof post.$inferSelect.id;
	reposts: PostReposts;
	userId?: Session['user']['id'];
}) {
	const mutation = useMutation({ mutationFn: repostAction });

	// allow content to be written or just repost with no content

	return (
		<>
			{/* text-cyan-500 */}
			<Button variant="ghost" size="lg" className="hover:text-sky-500" disabled={mutation.isPending}>
				{mutation.isPending ? <Loader className="size-5 animate-spin" /> : <Repeat2 className="size-5" />}
				{reposts.length + (mutation.isPending ? 1 : 0)}
			</Button>
		</>
	);
}
