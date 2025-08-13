import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { BadgeCheck, MessageCircle, Repeat2 } from 'lucide-react';
import { getMonthAndYear, getRelativeTime } from '~/lib/date';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Separator } from '../ui/separator';
import { MarkdownView } from '../Markdown';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import PostDropdown from './PostDropdown';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { getOS } from '~/lib/getOS';
import PostLike from './PostLike';
import type { auth } from '~/lib/auth/server';

export default function Post({ post, userId }: { post: any; userId?: typeof auth.$Infer.Session.user.id }) {
	function ProfilePicture() {
		return (
			<Avatar className="size-12">
				<AvatarImage
					src={post.originalPost?.author.image || post.author.image || '/user.svg'}
					alt={`${post.originalPost?.author.name || post.author.name}'s Avatar`}
				/>
				<AvatarFallback>
					{post.author.name
						.split(' ')
						.map((n: string[]) => n[0])
						.join('')}
				</AvatarFallback>
			</Avatar>
		);
	}

	function NameAndVerifiedBadge() {
		return (
			<>
				<span>{post.originalPost?.author.name || post.author.name}</span>
				<Tooltip>
					<TooltipTrigger>{post.author.verified && <BadgeCheck className="size-5 text-sky-500" />}</TooltipTrigger>
					<TooltipContent side="right">
						<p>Verified Account</p>
					</TooltipContent>
				</Tooltip>
			</>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<HoverCard>
					<HoverCardTrigger asChild>
						<div className="flex min-w-0 flex-row items-center gap-x-3">
							<ProfilePicture />
							<div className="flex min-w-0 flex-col">
								<div className="flex flex-row gap-x-2 text-xl leading-none">
									<NameAndVerifiedBadge />
								</div>
								<h4 className="text-sm text-stone-600 dark:text-stone-400" suppressHydrationWarning>
									{getRelativeTime(post.originalPost?.createdAt ?? post.createdAt)}
								</h4>
								<h5 className="text-muted-foreground w-full truncate text-xs">Post ID: {post.id}</h5>
							</div>
						</div>
					</HoverCardTrigger>
					<HoverCardContent side="top" className="w-fit">
						<div className="flex justify-between gap-4">
							<ProfilePicture />
							<div className="space-y-1">
								<div className="flex flex-col">
									<div className="flex flex-row gap-x-2 text-lg font-semibold">
										<NameAndVerifiedBadge />
									</div>
									<span className="text-muted-foreground text-xs">{post.author.id}</span>
									<span className="text-muted-foreground text-xs">BirdSky for {getOS(post.userAgent)}</span>
								</div>
								<p className="text-sm">Joined {getMonthAndYear(post.author.createdAt)}</p>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
				<PostDropdown id={post.id} initialLikes={post.likes} />
			</CardHeader>
			{/* This allows screenshotting only the content: */}
			<div>
				<Separator orientation="horizontal" />
				<CardContent className="my-6">
					<MarkdownView source={post.originalPost?.content ?? post.content ?? ''} />
				</CardContent>
				<Separator orientation="horizontal" />
			</div>
			<CardFooter className="flex items-center justify-between">
				{/* text-emerald-500 */}
				<Button variant="ghost" size="lg" className="hover:text-green-500">
					<MessageCircle className="size-5" />
					{post.replyCount}
				</Button>
				{/* text-cyan-500 */}
				<Button variant="ghost" size="lg" className="hover:text-sky-500">
					<Repeat2 className="size-5" />
					{post.repostCount}
				</Button>
				<PostLike likes={post.likes} id={post.id} userId={userId} />
			</CardFooter>
		</Card>
	);
}
