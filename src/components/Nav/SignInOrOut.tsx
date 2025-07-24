'use client';

import { Loader, LogIn, LogOut } from 'lucide-react';
import { DropdownMenuItem } from '~/components/ui/dropdown-menu';
import { signIn, signOut, useSession } from '~/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function SignInOrOut() {
	const session = useSession();
	const router = useRouter();

	if (session.isPending) {
		return (
			<DropdownMenuItem disabled>
				<Loader className="mr-2 size-4 animate-spin" />
				<span>Loading...</span>
			</DropdownMenuItem>
		);
	}

	return (
		<DropdownMenuItem
			variant={session.data ? 'destructive' : 'default'}
			onClick={async () => {
				if (session.data) {
					await signOut({ fetchOptions: { onSuccess: () => router.push('/') } });
				} else {
					await signIn.social({ provider: 'github', callbackURL: '/' });
				}
			}}
		>
			{session.data ? <LogOut className="mr-2 size-4" /> : <LogIn className="mr-2 size-4" />}
			<span>Sign {session.data ? 'out' : 'in with GitHub'}</span>
		</DropdownMenuItem>
	);
}
