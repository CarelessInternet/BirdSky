'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { MarkdownView } from '../Markdown';
import useIsOverflowing from '../useIsOverflowing';
import { FoldVertical, UnfoldVertical } from 'lucide-react';

export default function PostContent({ content }: { content: string }) {
	const { isOverflow, ref } = useIsOverflowing();
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
			<div
				ref={ref}
				className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
				style={{
					maxHeight: isExpanded ? undefined : 300,
				}}
			>
				<MarkdownView source={content} />
			</div>
			{(isOverflow || isExpanded) && (
				<Button size="sm" variant="outline" className="mt-4" onClick={() => setIsExpanded((p) => !p)}>
					{isExpanded ? (
						<>
							<FoldVertical />
							Show Less
						</>
					) : (
						<>
							<UnfoldVertical />
							Show More
						</>
					)}
				</Button>
			)}
		</>
	);
}
