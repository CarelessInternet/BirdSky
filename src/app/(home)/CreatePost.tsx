'use client';

import { MarkdownEditor } from '~/components/Markdown';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { useActionState, useEffect, useState } from 'react';
import createPost from './createPost';
import { type Schema, schema } from './formOptions';
import { Button } from '~/components/ui/button';
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
import { Loader, RotateCcw, Send, X } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';

export default function CreatePost() {
	const [state, action, isPending] = useActionState(createPost, {
		success: false,
		errors: {},
		values: { content: '# Be free!\n\n![BirdSky Logo](birdsky.png)' },
	});
	const form = useForm<Schema>({
		mode: 'onTouched',
		resolver: standardSchemaResolver(schema),
		defaultValues: state.values,
		...(!state.success && { errors: state.errors }),
	});
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (state.success) {
			setOpen(false);
		}
	}, [state.success]);

	// Overflow is hidden when closing the dialog.
	// https://github.com/shadcn-ui/ui/issues/6988
	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : 'auto';

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create a Post</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2/3">
				<Form {...form}>
					<form action={action}>
						<DialogHeader className="mb-4">
							<DialogTitle>Create a Post</DialogTitle>
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
											<FormDescription>You can even attach images and create tables!</FormDescription>
											<FormMessage />
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
								{isPending ? <Loader className="animate-spin" /> : <Send />} Post!
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
