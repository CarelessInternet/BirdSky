'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
import { NavigationMenuLink, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import type { ComponentProps, PropsWithChildren } from 'react';

export default function Link({
	children,
	href,
	sheet = false,
}: PropsWithChildren<{ href: ComponentProps<typeof NextLink>['href']; sheet?: boolean }>) {
	const pathname = usePathname();

	return sheet ? (
		<NextLink
			href={href}
			className={cn(
				'hover:text-primary block text-lg font-medium transition-colors',
				pathname === href && 'text-primary font-semibold',
			)}
		>
			{children}
		</NextLink>
	) : (
		<NavigationMenuLink
			className={cn(navigationMenuTriggerStyle(), 'text-base', pathname === href && 'bg-accent text-accent-foreground')}
			asChild
		>
			<NextLink href={href}>{children}</NextLink>
		</NavigationMenuLink>
	);
}
