'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { ClipboardCheck, Heart, MoreHorizontal, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { postLikes } from './footer/postLike';
import { postReposts } from './footer/postRepost';
import { useQuery } from '@tanstack/react-query';
import type { post } from '~/lib/database/schema';
import type { PostLikes, PostReposts } from './types';

export default function PostDropdown({
	id,
	initialLikes,
	initialReposts,
}: {
	id: typeof post.$inferSelect.id;
	initialLikes: PostLikes;
	initialReposts: PostReposts;
}) {
	const { data: likes } = useQuery({
		queryKey: ['post-likes', id],
		queryFn: () => postLikes(id),
		initialData: initialLikes,
	});
	const { data: reposts } = useQuery({
		queryKey: ['post-reposts', id],
		queryFn: () => postReposts(id),
		initialData: initialReposts,
	});

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreHorizontal />
						<span className="sr-only">More options</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard
								.writeText(`${window.location.origin}/posts/${id}`)
								.then(() => toast('URL copied to clipboard!', { dismissible: true, icon: <ClipboardCheck /> }))
								.catch((error) => {
									console.error(error);
									toast('Could not copy the URL to clipboard.', { dismissible: true });
								});
						}}
					>
						<Share />
						Share
					</DropdownMenuItem>
					<DialogTrigger asChild>
						<DropdownMenuItem className="focus:text-destructive">
							<Heart />
							<span>See who liked the post</span>
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>wsehew</DialogTitle>
					<DialogDescription>
						Likes: {likes.map((like) => like.author.name).join(', ')}
						<br />
						Reposts: {reposts.map((repost) => repost.author.name).join(', ')}
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
