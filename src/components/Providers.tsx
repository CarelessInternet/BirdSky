'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { getQueryClient } from '~/lib/query';

export default function ThemeProvider({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>
				<NextThemesProvider
					attribute={['class', 'data-color-mode']}
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</NextThemesProvider>
			</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
}
