import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { CircleCheck } from 'lucide-react';
import { getRelativeTime } from '~/lib/date';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Separator } from '../ui/separator';
import { MarkdownView } from '../Markdown';

export default function Post({ post }: { post: any }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center gap-x-3">
				<Avatar className="size-12">
					<AvatarImage src={post.author.image || '/user.svg'} />
					<AvatarFallback>
						{post.author.name
							.split(' ')
							.map((n: string[]) => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="flex flex-row items-center gap-x-2 text-lg leading-none">
						{post.author.name}
						{!post.author.verified && <CircleCheck className="size-5 text-sky-500" />}
					</span>
					{/* Show this in the hover card. */}
					{/* <span className="text-muted-foreground text-xs">{post.author.id}</span> */}
					<h4 className="text-sm text-stone-600 dark:text-stone-400">
						{getRelativeTime(post.originalPost?.createdAt ?? post.createdAt)}
					</h4>
				</div>
			</CardHeader>
			<Separator />
			<CardContent>
				<MarkdownView source={post.originalPost?.content ?? post.content ?? ''} />
			</CardContent>
			<Separator />
			<CardFooter>{post.replyCount}</CardFooter>
		</Card>
	);
}
