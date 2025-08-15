// TODO

'use client';

import { useMutation } from '@tanstack/react-query';
import repost from './postRepost';
import { Button } from '../../ui/button';
import { Loader, Repeat2 } from 'lucide-react';

export default function PostRepost({ repostCount }: { repostCount: number }) {
	const mutation = useMutation({ mutationFn: repost });

	return (
		<>
			{/* text-cyan-500 */}
			<Button variant="ghost" size="lg" className="hover:text-sky-500" disabled={mutation.isPending}>
				{mutation.isPending ? <Loader className="size-5 animate-spin" /> : <Repeat2 className="size-5" />}
				{repostCount + (mutation.isPending ? 1 : 0)}
			</Button>
		</>
	);
}
