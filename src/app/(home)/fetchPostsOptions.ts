import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchPosts } from '~/lib/actions/fetchPosts';

export const fetchPostsOptions = infiniteQueryOptions({
	queryKey: ['posts'],
	queryFn: fetchPosts,
	initialPageParam: 0,
	getPreviousPageParam: (firstPage) => firstPage.previousCursor,
	getNextPageParam: (lastPage) => lastPage.nextCursor,
});
