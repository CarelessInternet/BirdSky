'use client';

import Image from 'next/image';
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
import { signIn, signOut, useSession } from '~/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Dropdown() {
	const { data, isPending } = useSession();
	const router = useRouter();
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="hover:bg-accent/50 flex items-center space-x-1">
					{!isPending && data?.user.image ? (
						<Image
							src={data.user.image}
							alt="User Avatar"
							width={32}
							height={32}
							className="mr-2 inline-block rounded-full"
						/>
					) : (
						<User className="size-6" />
					)}
					<ChevronDown className="size-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>{isPending ? 'Loading...' : (data?.user.name ?? 'My Account')}</DropdownMenuLabel>
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
					onClick={async () => {
						if (data) {
							await signOut({ fetchOptions: { onSuccess: () => router.push('/') } });
						} else {
							await signIn.social({ provider: 'github', callbackURL: '/' });
						}
					}}
				>
					{data ? <LogOut className="mr-2 size-4" /> : <LogIn className="mr-2 size-4" />}
					<span>Sign {data ? 'out' : 'in with GitHub'}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
