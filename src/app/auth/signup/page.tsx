'use client';

import Image from 'next/image';
import Link from 'next/link';
import BirdSky from '../../../app/favicon.ico';
import GitHub from '../../../../public/GitHub.svg';
import GitHubWhite from '../../../../public/GitHub-White.svg';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useActionState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { schema, type Schema } from './formOptions';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import signUp from './signUp';
import { signIn } from '~/lib/auth/client';
import { useTheme } from 'next-themes';

export default function SignUp() {
	const [state, action, isPending] = useActionState(signUp, {
		success: false,
		errors: {},
		values: { name: '', email: '', password: '' },
	});
	const form = useForm<Schema>({
		mode: 'onTouched',
		resolver: standardSchemaResolver(schema),
		defaultValues: state.values,
		...(!state.success && { errors: state.errors }),
	});

	const { theme } = useTheme();
	const [isOAuthPending, startOAuthTransition] = useTransition();

	return (
		<main className="flex w-full flex-1 items-center justify-center px-4 py-4">
			<Form {...form}>
				<form action={action}>
					<div className="flex w-4/5 flex-col gap-6 sm:w-sm md:w-md">
						<div className="flex flex-col items-center gap-2">
							<a href="#" className="flex flex-col items-center gap-2 font-medium">
								<Image src={BirdSky} alt="BirdSky Favicon" width={32} height={32} />
							</a>
							<h1 className="text-xl font-bold">Sign Up to BirdSky</h1>
							<div className="text-center text-sm">
								Already have an account?{' '}
								<Link href="/auth/signin" className="underline underline-offset-4">
									Sign In
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-3">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>E-mail</FormLabel>
											<FormControl>
												<Input placeholder="email@example.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-3">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							{!state.success && <p className="text-destructive">{state.errors.root?.message}</p>}
							<Button type="submit" disabled={!form.formState.isValid || isPending}>
								Sign Up
							</Button>
						</div>
						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-background text-muted-foreground relative z-10 px-2">Or</span>
						</div>
						<div className="flex justify-center">
							<Button
								variant="outline"
								type="button"
								onClick={() =>
									startOAuthTransition(async () => {
										await signIn.social({ provider: 'github', callbackURL: '/' });
									})
								}
								disabled={isOAuthPending || isPending}
							>
								<Image src={theme === 'light' ? GitHub : GitHubWhite} alt="GitHub Logo" width={24} height={24} />
								Continue with GitHub
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</main>
	);
}
