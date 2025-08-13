'use client';

import NextLink from 'next/link';
import { User, ChevronDown, LogOut, LogIn, Monitor, Moon, Sun, SunMoon } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { signOut, useSession } from '~/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTransition } from 'react';

export default function Dropdown() {
	const { data, isPending } = useSession();
	const router = useRouter();
	const { setTheme } = useTheme();

	const [isTransitionPending, startTransition] = useTransition();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="hover:bg-accent/50 flex items-center space-x-1">
					<Avatar className="mr-2 inline-block size-8 rounded-full">
						<AvatarImage src={data?.user.image ?? undefined} alt={`${data?.user.name}'s Avatar`} />
						<AvatarFallback>
							{data?.user.name
								.split(' ')
								.map((n) => n[0])
								.join('') || '?'}
						</AvatarFallback>
					</Avatar>
					<ChevronDown className="size-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					{isPending ? (
						'Loading...'
					) : (
						<div className="flex flex-col">
							<span>{data?.user.name ?? 'Not Signed In'}</span>
							{!!data && <span className="text-muted-foreground truncate text-xs">{data.user.id}</span>}
						</div>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{!isPending && data && (
					<DropdownMenuItem asChild>
						<NextLink href={`/users/${data.user.id}`}>
							<User className="mr-2 size-4" />
							<span>Profile</span>
						</NextLink>
					</DropdownMenuItem>
				)}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="flex items-center justify-start gap-x-1.5 px-2 py-1 text-sm leading-7">
						<SunMoon className="mr-2 size-4" />
						<span>Change Theme</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme('light')}>
								<Sun className="mr-2 size-4" />
								<span>Light</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								<Moon className="mr-2 size-4" />
								<span>Dark</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('system')}>
								<Monitor className="mr-2 size-4" />
								<span>System</span>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant={data ? 'destructive' : 'default'}
					onClick={() =>
						startTransition(async () => {
							if (data) {
								await signOut({ fetchOptions: { onSuccess: () => router.push('/') } });
							} else {
								router.push('/auth/signin');
							}
						})
					}
					disabled={isTransitionPending}
				>
					{data ? <LogOut className="mr-2 size-4" /> : <LogIn className="mr-2 size-4" />}
					<span>Sign {data ? 'out' : 'in'}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
