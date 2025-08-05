'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import type { ComponentProps } from 'react';
import { getExtraCommands } from '@uiw/react-md-editor';
// rehype-sanitize gets rid of GitHub alerts in Markdown syntax :(.
import rehypeSanitize from 'rehype-sanitize';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
	loading: () => (
		<div className="flex flex-row items-center">
			<Loader className="mr-2 size-4 animate-spin" />
			<span>Loading editor...</span>
		</div>
	),
});

const MDView = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown), {
	loading: () => (
		<div className="flex flex-row items-center">
			<Loader className="mr-2 size-4 animate-spin" />
			<span>Loading view...</span>
		</div>
	),
});

export function MarkdownEditor(props: ComponentProps<typeof MDEditor>) {
	return (
		<MDEditor
			previewOptions={{ rehypePlugins: [rehypeSanitize] }}
			// Do not allow going into fullscreen mode.
			extraCommands={getExtraCommands().filter((command) => command.keyCommand === 'preview')}
			height={300}
			spellCheck
			{...props}
		/>
	);
}

export function MarkdownView(props: ComponentProps<typeof MDView>) {
	return <MDView className="bg-transparent!" rehypePlugins={[rehypeSanitize]} {...props} />;
}
