'use client';

import { useMutation } from '@tanstack/react-query';
import { quoteAction, repostAction } from './postRepost';
import { Button } from '../../ui/button';
import { Loader, Quote, Repeat2, RotateCcw, Send, X } from 'lucide-react';
import type { PostReposts } from '../types';
import type { Session } from '~/lib/auth/client';
import { post } from '~/lib/database/schema';
import { useActionState, useEffect, useState } from 'react';
import { getQueryClient } from '~/lib/query';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { type QuoteSchema, quoteSchema } from './formOptions';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { MarkdownEditor } from '~/components/Markdown';
import { Input } from '~/components/ui/input';

export default function PostRepost({
	id,
	isRepost,
	reposts: serverReposts,
	userId,
}: {
	id: typeof post.$inferSelect.id;
	isRepost: boolean;
	reposts: PostReposts;
	userId?: Session['user']['id'];
}) {
	// Repost data and cache invalidation.
	const [hasUserReposted, setHasUserReposted] = useState(serverReposts.some((repost) => repost.author.id === userId));
	const [reposts, setReposts] = useState(serverReposts.length);

	const queryClient = getQueryClient();

	const toggleRepost = () => {
		setHasUserReposted((reposted) => !reposted);
		setReposts((amount) => amount + (hasUserReposted ? -1 : 1));
	};
	const invalidateReposts = () => {
		queryClient.invalidateQueries({ queryKey: ['post-reposts', id] });
	};

	const mutation = useMutation({
		mutationFn: repostAction,
		onMutate: toggleRepost,
		onSuccess: (newReposts) => setReposts(newReposts),
		onError: toggleRepost,
		onSettled: invalidateReposts,
	});

	// Quote action.
	const [state, action, isPending] = useActionState(quoteAction, {
		success: false,
		errors: {},
		values: { content: '# Look at the post below!', id },
	});
	const form = useForm<QuoteSchema>({
		mode: 'onTouched',
		resolver: standardSchemaResolver(quoteSchema),
		defaultValues: state.values,
		...(!state.success && { errors: state.errors }),
	});
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (state.success) {
			toggleRepost();
			setOpen(false);
			invalidateReposts();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	// Overflow is hidden when closing the dialog.
	// https://github.com/shadcn-ui/ui/issues/6988
	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : 'auto';

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [open]);

	if (hasUserReposted) {
		return (
			<Button
				variant="ghost"
				size="lg"
				className={'hover:text-sky-500 ' + (hasUserReposted ? 'text-cyan-500' : '')}
				onClick={() => mutation.mutate(id)}
				disabled={
					// TODO: for now we temporarily don't allow reposting a repost.
					!userId || mutation.isPending || isRepost
				}
			>
				{mutation.isPending ? (
					<Loader className="size-5 animate-spin" />
				) : (
					<Repeat2 className={'size-5 ' + (hasUserReposted ? 'text-cyan-500' : '')} />
				)}
				{reposts}
			</Button>
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="lg"
						className={'hover:text-sky-500 ' + (hasUserReposted ? 'text-cyan-500' : '')}
						disabled={
							// TODO: for now we temporarily don't allow reposting a repost.
							!userId || mutation.isPending || isRepost
						}
					>
						{mutation.isPending ? (
							<Loader className="size-5 animate-spin" />
						) : (
							<Repeat2 className={'size-5 ' + (hasUserReposted ? 'text-cyan-500' : '')} />
						)}
						{reposts}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Repost Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => mutation.mutate(id)}>
						<Repeat2 /> Repost
					</DropdownMenuItem>
					<DialogTrigger asChild>
						<DropdownMenuItem>
							<Quote /> Quote
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent className="sm:max-w-2/3">
				<Form {...form}>
					<form action={action}>
						<DialogHeader className="mb-4">
							<DialogTitle>Quote the Post</DialogTitle>
							<DialogDescription>Use your imagination and let the sky be the limit!</DialogDescription>
						</DialogHeader>
						<div className="mb-4 grid gap-4">
							<div className="grid gap-3">
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Content:</FormLabel>
											<FormControl>
												<MarkdownEditor textareaProps={{ ...field }} value={field.value} onChange={field.onChange} />
											</FormControl>
											<FormDescription>
												You can even attach images and create tables! On small displays, toggle the edit mode to only
												show your content.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="id"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input type="hidden" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						{!state.success && <p className="text-destructive">{state.errors.root?.message}</p>}
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">
									<X />
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="reset"
								variant="destructive"
								onClick={(event) => {
									event.preventDefault();
									form.reset();
								}}
							>
								<RotateCcw />
								Reset
							</Button>
							<Button type="submit" disabled={!form.formState.isValid || isPending}>
								{isPending ? <Loader className="animate-spin" /> : <Send />} Quote!
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
