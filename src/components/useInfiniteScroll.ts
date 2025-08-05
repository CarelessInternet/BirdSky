// Mainly from https://github.com/CarelessInternet/next-twitter/blob/main/src/components/InfiniteScroll.tsx
// https://github.com/gabrielelpidio/next-infinite-scroll-server-actions
// https://stackoverflow.com/a/76267950/12425926

'use client';

import { useRef, useEffect, useState } from 'react';

export function useInfiniteScroll<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const signal = new AbortController();
		const element = ref.current;

		const observer = new IntersectionObserver(([entry]) => {
			setInView(entry.isIntersecting);
		});

		if (element) {
			observer.observe(element);
		}

		return () => {
			signal.abort();

			if (element) {
				observer.unobserve(element);
			}
		};
	}, [ref]);

	return { ref, inView };
}
