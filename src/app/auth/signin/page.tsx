'use client';

import Link from 'next/link';
import Image from 'next/image';
import BirdSky from '../../../app/favicon.ico';
import GitHub from '../../../../public/GitHub.svg';
import GitHubWhite from '../../../../public/GitHub-White.svg';
import { useActionState, useTransition } from 'react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import signInAction from './signIn';
import { type Schema, schema } from './formOptions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { signIn } from '~/lib/auth/client';
import { useTheme } from 'next-themes';

export default function SignIn() {
	const [state, action, isPending] = useActionState(signInAction, {
		success: false,
		errors: {},
		values: { email: '', password: '' },
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
			<div className="flex w-5/6 flex-col gap-6 sm:w-sm md:w-md">
				<Card>
					<CardHeader className="text-center">
						<div className="flex justify-center">
							<Image src={BirdSky} alt="BirdSky Favicon" width={32} height={32} />
						</div>
						<CardTitle className="text-xl">Welcome back to BirdSky!</CardTitle>
						<CardDescription>Login with your GitHub account</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form action={action}>
								<div className="grid gap-6">
									<div className="flex flex-col gap-4">
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
									<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
										<span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
									</div>
									<div className="grid gap-6">
										<div className="grid gap-3">
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>E-mail</FormLabel>
														<FormControl>
															<Input type="email" placeholder="email@example.com" {...field} />
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
											Sign In
										</Button>
									</div>
									<div className="text-center text-sm">
										Don&apos;t have an account?{' '}
										<Link href="/auth/signup" className="underline underline-offset-4">
											Sign up
										</Link>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
