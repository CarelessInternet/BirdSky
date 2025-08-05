'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { getQueryClient } from '~/lib/query';

export default function ThemeProvider({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<NextThemesProvider
				attribute={['class', 'data-color-mode']}
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</NextThemesProvider>
		</QueryClientProvider>
	);
}
