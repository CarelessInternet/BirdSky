import './globals.css';
import { DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import Providers from '~/components/Providers';
import Navbar from '~/components/nav/Navbar';
import { Toaster } from '~/components/ui/sonner';
import { cn } from '~/lib/utils';

const font = DM_Sans({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'BirdSky',
	description: 'High in the sky, the birds fly freely.',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			{/* <head>
				<script defer src="https://unpkg.com/react-scan/dist/auto.global.js" />
			</head> */}
			<body className={cn('flex min-h-screen flex-col', font.className)}>
				<Providers>
					<Navbar />
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
