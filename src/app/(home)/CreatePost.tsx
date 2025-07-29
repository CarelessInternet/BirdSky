'use client';

import { useActionState } from 'react';
import { initialFormState } from '@tanstack/react-form/nextjs';
import { mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form';
import MDEditor from '~/components/MDEditor';
import { getExtraCommands } from '@uiw/react-md-editor';
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
import createPost from './createPost';
import { Loader } from 'lucide-react';
import { formOptions } from './formOptions';
import { flattenFormErrors } from '~/lib/form';

export default function CreatePost() {
	const [state, action] = useActionState(createPost, initialFormState);
	const form = useForm({
		...formOptions,
		transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
	});
	// @ts-expect-error: The onServer object is not typed correctly.
	const serverFormErrors = useStore(form.store, (formState) => flattenFormErrors(formState.errorMap.onServer?.form));

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2/3">
				<form action={action as never} onSubmit={() => form.handleSubmit()}>
					<DialogHeader className="mb-4">
						<DialogTitle>Create a Post</DialogTitle>
						<DialogDescription>Use your imagination and let the sky be the limit!</DialogDescription>
					</DialogHeader>
					<div className="mb-4 grid gap-4">
						<div className="grid gap-3">
							<form.Field name="content">
								{(field) => {
									return (
										<>
											<MDEditor
												// The name field is very important to receive the correct form data!
												textareaProps={{ name: field.name }}
												value={field.state.value}
												onChange={(_, event) => field.handleChange(event!.target.value)}
												// Do not allow going into fullscreen mode.
												extraCommands={getExtraCommands().filter((command) => command.keyCommand === 'preview')}
												height={300}
												spellCheck
											/>
											{!field.state.meta.isValid && (
												<p className="text-destructive">
													{field.state.meta.errors.map((error) => error?.message).join('\n')}
												</p>
											)}
										</>
									);
								}}
							</form.Field>
						</div>
					</div>
					{serverFormErrors.map((error, idx) => (
						<p className="text-destructive" key={idx}>
							{error}
						</p>
					))}
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button
							type="reset"
							variant="destructive"
							onClick={(event) => {
								event.preventDefault();
								form.reset();
							}}
						>
							Reset
						</Button>
						<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
							{([canSubmit, isSubmitting]) => (
								<Button type="submit" disabled={!canSubmit}>
									{isSubmitting && <Loader className="mr-2 size-4 animate-spin" />} Post!
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
