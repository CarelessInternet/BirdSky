import { queryOptions } from '@tanstack/react-query';
import getPosts from '~/lib/actions/getPosts';

export const fetchPostsOptions = queryOptions({
	queryKey: ['posts'],
	queryFn: getPosts,
});
