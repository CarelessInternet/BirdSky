'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { ClipboardCheck, MoreHorizontal, RotateCw, Share, UserStar } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { postLikes } from './footer/postLike';
import { postReposts } from './footer/postRepost';
import { useQuery } from '@tanstack/react-query';
import type { post } from '~/lib/database/schema';
import type { PostLikes, PostReposts } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getRelativeTime } from '~/lib/date';
import { useState } from 'react';
import Link from 'next/link';
import { getOS } from '~/lib/getOS';

export default function PostDropdown({
	id,
	initialLikes,
	initialReposts,
}: {
	id: typeof post.$inferSelect.id;
	initialLikes: PostLikes;
	initialReposts: PostReposts;
}) {
	const likes = useQuery({
		queryKey: ['post-likes', id],
		queryFn: () => postLikes(id),
		initialData: initialLikes,
	});
	const reposts = useQuery({
		queryKey: ['post-reposts', id],
		queryFn: () => postReposts(id),
		initialData: initialReposts,
	});

	const [tab, setTab] = useState('likes');
	const isPending = likes.isRefetching || reposts.isRefetching;
	const refetchData = () => {
		switch (tab) {
			case 'likes':
				return likes.refetch();
			default:
				reposts.refetch();
		}
	};

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
							<UserStar />
							<span>Likes & Reposts</span>
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent className="md:max-w-2/3">
				<DialogHeader>
					<DialogTitle>View Likes & Reposts</DialogTitle>
				</DialogHeader>
				<Tabs value={tab} onValueChange={setTab} className="min-w-0">
					<TabsList>
						<TabsTrigger value="likes">Likes</TabsTrigger>
						<TabsTrigger value="reposts">Reposts</TabsTrigger>
					</TabsList>
					<TabsContent value="likes">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>User</TableHead>
									<TableHead>User ID</TableHead>
									<TableHead>Like Date</TableHead>
									<TableHead>Platform</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{likes.data.map((like) => (
									<TableRow key={like.id}>
										<TableCell>{like.id}</TableCell>
										<TableCell>{like.author.name}</TableCell>
										<TableCell>{like.author.id}</TableCell>
										<TableCell suppressHydrationWarning>{getRelativeTime(like.createdAt)}</TableCell>
										<TableCell>{getOS(like.userAgent)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TabsContent>
					<TabsContent value="reposts">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>User</TableHead>
									<TableHead>User ID</TableHead>
									<TableHead>Repost Date</TableHead>
									<TableHead>Platform</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{reposts.data.map((repost) => (
									<TableRow key={repost.id}>
										<TableCell>
											<Link href={`/posts/${repost.id}`} className="underline underline-offset-2">
												{repost.id}
											</Link>
										</TableCell>
										<TableCell>{repost.author.name}</TableCell>
										<TableCell>{repost.author.id}</TableCell>
										<TableCell suppressHydrationWarning>{getRelativeTime(repost.createdAt)}</TableCell>
										<TableCell>{getOS(repost.userAgent)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<Button onClick={refetchData} disabled={isPending}>
						<RotateCw /> Refresh
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
