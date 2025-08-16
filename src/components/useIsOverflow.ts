'use client';

import { useState, useLayoutEffect, useRef } from 'react';

export default function useIsOverflow<T extends HTMLDivElement>() {
	const ref = useRef<T>(null);
	const [isOverflow, setIsOverflow] = useState(false);

	useLayoutEffect(() => {
		const current = ref.current;
		const check = () => {
			setIsOverflow(!!current && current.scrollHeight > current.clientHeight);
		};
		if (current) {
			check();
			if ('ResizeObserver' in window) {
				const ro = new ResizeObserver(check);
				ro.observe(current);
				return () => ro.disconnect();
			}
		}
	}, [ref]);

	return { ref, isOverflow };
}
