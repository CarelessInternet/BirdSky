import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { BadgeCheck, MessageCircle, MessageSquareQuote } from 'lucide-react';
import { getMonthAndYear, getRelativeTime } from '~/lib/date';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import PostDropdown from './PostDropdown';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { getOS } from '~/lib/getOS';
import PostLike from './footer/PostLike';
// todo: don't rely on fetchPosts type.
import type { PostData } from '~/app/(home)/fetchPosts';
import PostRepost from './footer/PostRepost';
import type { Session } from '~/lib/auth/client';
import PostContent from './PostContent';
import type { PropsWithChildren } from 'react';

function ProfilePicture({ author }: { author: PostData['author'] }) {
	return (
		<Avatar className="size-12">
			<AvatarImage src={author.image || undefined} alt={`${author.name}'s Avatar`} />
			<AvatarFallback>
				{author.name
					.split(' ')
					.map((n) => n.at(0))
					.join('')}
			</AvatarFallback>
		</Avatar>
	);
}

function NameAndVerifiedBadge({ author }: { author: PostData['author'] }) {
	return (
		<>
			<span className="truncate">{author.name}</span>
			<Tooltip>
				<TooltipTrigger>{author.verified && <BadgeCheck className="size-5 text-sky-500" />}</TooltipTrigger>
				<TooltipContent side="right">
					<p>Verified Account</p>
				</TooltipContent>
			</Tooltip>
		</>
	);
}

function UserHoverCard({ author, children, userAgent }: PropsWithChildren<Pick<PostData, 'author' | 'userAgent'>>) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent side="top" className="w-auto max-w-xs">
				<div className="flex justify-between gap-4">
					<ProfilePicture author={author} />
					<div className="min-w-0 space-y-1">
						<div className="flex flex-col">
							<div className="flex flex-row gap-x-2 text-lg font-semibold">
								<NameAndVerifiedBadge author={author} />
							</div>
							<span className="text-muted-foreground truncate text-xs">{author.id}</span>
							<span className="text-muted-foreground text-xs">BirdSky for {getOS(userAgent)}</span>
						</div>
						<p className="text-sm">Joined {getMonthAndYear(author.createdAt)}</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default function Post({ post, userId }: { post: PostData; userId?: Session['user']['id'] }) {
	// TODO: display quote content properly.

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex min-w-0 flex-col">
					{post.originalPost && (
						<div className="mb-3 flex flex-row items-center gap-1.5">
							<MessageSquareQuote className="size-4" />
							<span className="text-sm text-stone-500 dark:text-stone-300" suppressHydrationWarning>
								{post.author.name} reposted {getRelativeTime(post.createdAt)}: {post.content}
							</span>
						</div>
					)}
					<UserHoverCard author={post.originalPost?.author ?? post.author} userAgent={post.userAgent}>
						<div className="flex min-w-0 flex-row items-center gap-x-3">
							<ProfilePicture author={post.originalPost?.author ?? post.author} />
							<div className="flex min-w-0 flex-col">
								<div className="flex flex-row gap-x-2 text-xl leading-none">
									<NameAndVerifiedBadge author={post.originalPost?.author ?? post.author} />
								</div>
								<h4 className="text-sm text-stone-600 dark:text-stone-400" suppressHydrationWarning>
									{getRelativeTime(post.originalPost?.createdAt ?? post.createdAt)}
								</h4>
								<h5 className="text-muted-foreground w-full truncate text-xs">{post.id}</h5>
							</div>
						</div>
					</UserHoverCard>
				</div>
				<PostDropdown id={post.id} initialLikes={post.likes} initialReposts={post.reposts} />
			</CardHeader>
			{/* This allows screenshotting only the content: */}
			<div>
				<Separator orientation="horizontal" />
				<CardContent className="my-6">
					<PostContent content={post.originalPost?.content ?? post.content ?? ''} />
				</CardContent>
				<Separator orientation="horizontal" />
			</div>
			<CardFooter className="flex items-center justify-between">
				{/* text-emerald-500 */}
				<Button variant="ghost" size="lg" className="hover:text-green-500">
					<MessageCircle className="size-5" />
					{post.replyCount}
				</Button>
				<PostRepost id={post.id} isRepost={!!post.originalPost} reposts={post.reposts} userId={userId} />
				<PostLike id={post.id} likes={post.likes} userId={userId} />
			</CardFooter>
		</Card>
	);
}
