import './globals.css';
import { DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import ThemeProvider from '~/components/ThemeProvider';
import Navbar from '~/components/Nav/Navbar';
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
			<body className={cn('flex min-h-screen flex-col', font.className)}>
				<ThemeProvider>
					<Navbar />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
