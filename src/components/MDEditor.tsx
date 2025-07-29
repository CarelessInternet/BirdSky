import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
	ssr: false,
	loading: () => (
		<div className="flex flex-row items-center">
			<Loader className="mr-2 size-4 animate-spin" />
			<span>Loading editor...</span>
		</div>
	),
});

export default MDEditor;
