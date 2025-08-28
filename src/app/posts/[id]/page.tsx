import z from 'zod';
import { notFound } from 'next/navigation';
import { fetchPost } from '~/lib/actions/fetchPosts';
import Post from '~/components/post/Post';

export default async function Page({ params }: PageProps<'/posts/[id]'>) {
	const { id } = await params;

	if (!z.uuidv7().safeParse(id).success) {
		return notFound();
	}

	const post = await fetchPost(id);

	if (!post) {
		notFound();
	}

	return (
		<main className="mx-auto mt-4 w-full max-w-3xl px-4 py-4">
			<Post post={post} />
		</main>
	);
}
