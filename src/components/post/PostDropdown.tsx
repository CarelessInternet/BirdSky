'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { ClipboardCheck, MoreHorizontal, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { post } from '~/lib/database/schema';
import { toast } from 'sonner';

export default function PostDropdown({ id }: { id: typeof post.$inferSelect.id }) {
	return (
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
