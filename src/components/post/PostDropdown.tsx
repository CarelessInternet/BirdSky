'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { ClipboardCheck, Heart, MoreHorizontal, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { post } from '~/lib/database/schema';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { postLikes } from './postLike';
import { useQuery } from '@tanstack/react-query';

export default function PostDropdown({ id }: { id: typeof post.$inferSelect.id }) {
	const { data: likes } = useQuery({ queryKey: ['post-likes', id], queryFn: () => postLikes(id) });

	return (
		<Sheet>
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
								.catch((error: unknown) => {
									console.error(error);
									toast('Could not copy the URL to clipboard.', { dismissible: true });
								});
						}}
					>
						<Share />
						Share
					</DropdownMenuItem>
					<SheetTrigger asChild>
						<DropdownMenuItem className="focus:text-destructive">
							<Heart />
							<span>See who liked the post</span>
						</DropdownMenuItem>
					</SheetTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>wsehew</SheetTitle>
					<SheetDescription>Likes: {likes?.map((like) => like.author.name)}</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
