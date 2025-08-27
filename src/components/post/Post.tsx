import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { BadgeCheck, MessageCircle, MessageSquareQuote } from 'lucide-react';
import { getRelativeTime, getYearMonthDay } from '~/lib/date';
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
import { cn } from '~/lib/utils';

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

function NameAndVerifiedBadge({ author, truncate = true }: { author: PostData['author']; truncate?: boolean }) {
	return (
		<>
			<span className={cn('min-w-0 wrap-anywhere', truncate && 'truncate')}>{author.name}</span>
			{author.verified && (
				<Tooltip>
					<TooltipTrigger>
						<BadgeCheck className="size-5 text-sky-500" />
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Verified Account since {getYearMonthDay(author.verified)}</p>
					</TooltipContent>
				</Tooltip>
			)}
		</>
	);
}

function UserHoverCard({ author, children, userAgent }: PropsWithChildren<Pick<PostData, 'author' | 'userAgent'>>) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent side="top" className="xs:max-w-sm w-auto max-w-xs">
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
						<p className="text-sm">Joined {getYearMonthDay(author.createdAt)}</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default function Post({
	post,
	userId,
	isRepost = false,
}: {
	post: PostData;
	userId?: Session['user']['id'];
	isRepost?: boolean;
}) {
	if (post.originalPost) {
		// Remove originalPost but rewrite the post data from the repost to the original post.
		const repostedPost = { ...post, ...post.originalPost, originalPost: null } satisfies PostData;

		return (
			<Card>
				<CardHeader className="flex min-w-0 flex-col">
					{!post.content && (
						<UserHoverCard author={post.author} userAgent={post.userAgent}>
							<div className="mb-1 flex flex-col gap-y-1">
								<div className="flex min-w-0 flex-row items-start gap-1.5">
									<MessageSquareQuote className="mt-1 size-4 shrink-0 self-start" />
									<span className="flex min-w-0 flex-col">
										<span
											className={cn(
												'min-w-0 flex-1 text-sm wrap-anywhere hyphens-auto text-stone-500 dark:text-stone-300',
											)}
										>
											<span className="inline-flex min-w-0 items-center gap-x-1">
												<NameAndVerifiedBadge author={post.author} truncate={false} />
											</span>
											<span suppressHydrationWarning> reposted {getRelativeTime(post.createdAt)}</span>
										</span>
										<span className="text-muted-foreground truncate text-xs">{post.id}</span>
									</span>
								</div>
							</div>
						</UserHoverCard>
					)}
					<div className="flex w-full flex-row items-center justify-between">
						<UserHoverCard
							author={post.content ? post.author : post.originalPost.author}
							userAgent={post.content ? post.userAgent : post.originalPost.userAgent}
						>
							<div className="flex min-w-0 flex-row items-center gap-x-3">
								<ProfilePicture author={post.content ? post.author : post.originalPost.author} />
								<div className="flex min-w-0 flex-col">
									<div className="flex flex-row gap-x-2 text-xl leading-none">
										<NameAndVerifiedBadge author={post.content ? post.author : post.originalPost.author} />
									</div>
									<h4 className="text-sm text-stone-600 dark:text-stone-400" suppressHydrationWarning>
										{getRelativeTime(post.content ? post.createdAt : post.originalPost.createdAt)}
									</h4>
									<h5 className="text-muted-foreground w-full truncate text-xs">
										{post.content ? post.id : post.originalPost.id}
									</h5>
								</div>
							</div>
						</UserHoverCard>
						<PostDropdown id={post.id} initialLikes={post.likes} initialReposts={post.reposts} />
					</div>
				</CardHeader>
				{/* This allows screenshotting only the content: */}
				<div>
					<Separator orientation="horizontal" />
					<CardContent className="my-6">
						{post.content ? (
							<>
								<PostContent content={post.content} />
								<div className="mt-6">
									<Post post={repostedPost} userId={userId} isRepost />
								</div>
							</>
						) : (
							<PostContent content={post.originalPost.content ?? ''} />
						)}
					</CardContent>
					<Separator orientation="horizontal" />
				</div>
				<CardFooter className="flex items-center justify-between">
					{/* text-emerald-500 */}
					<Button variant="ghost" size="lg" className="hover:text-green-500">
						<MessageCircle className="size-5" />
						{post.replyCount}
					</Button>
					<PostRepost id={post.id} isRepost reposts={post.reposts} userId={userId} />
					<PostLike id={post.id} likes={post.likes} userId={userId} />
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex min-w-0 flex-col">
				{post.originalPost && !post.content && (
					<UserHoverCard author={post.author} userAgent={post.userAgent}>
						<div className="mb-3 flex min-w-0 flex-row items-center gap-1.5">
							<MessageSquareQuote className="size-4 shrink-0" />
							<span
								className="min-w-0 flex-1 text-sm wrap-anywhere hyphens-auto text-stone-500 dark:text-stone-300"
								suppressHydrationWarning
							>
								{post.author.name} reposted {getRelativeTime(post.createdAt)}
							</span>
						</div>
					</UserHoverCard>
				)}
				<div className="flex w-full flex-row items-center justify-between">
					<UserHoverCard author={post.author} userAgent={post.userAgent}>
						<div className="flex min-w-0 flex-row items-center gap-x-3">
							<ProfilePicture author={post.author} />
							<div className="flex min-w-0 flex-col">
								<div className="flex flex-row gap-x-2 text-xl leading-none">
									<NameAndVerifiedBadge author={post.author} />
								</div>
								<h4 className="text-sm text-stone-600 dark:text-stone-400" suppressHydrationWarning>
									{getRelativeTime(post.createdAt)}
								</h4>
								<h5 className="text-muted-foreground w-full truncate text-xs">{post.id}</h5>
							</div>
						</div>
					</UserHoverCard>
					{!isRepost && <PostDropdown id={post.id} initialLikes={post.likes} initialReposts={post.reposts} />}
				</div>
			</CardHeader>
			{/* This allows screenshotting only the content: */}
			<div>
				<Separator orientation="horizontal" />
				<CardContent className={isRepost ? 'mt-6' : 'my-6'}>
					<PostContent content={post.content ?? ''} />
				</CardContent>
				{!isRepost && <Separator orientation="horizontal" />}
			</div>
			{!isRepost && (
				<CardFooter className="flex items-center justify-between">
					{/* text-emerald-500 */}
					<Button variant="ghost" size="lg" className="hover:text-green-500">
						<MessageCircle className="size-5" />
						{post.replyCount}
					</Button>
					<PostRepost id={post.id} isRepost={!!post.originalPost} reposts={post.reposts} userId={userId} />
					<PostLike id={post.id} likes={post.likes} userId={userId} />
				</CardFooter>
			)}
		</Card>
	);
}
