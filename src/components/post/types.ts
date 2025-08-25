import type { like, user } from '~/lib/database/schema';

export type Author = Pick<typeof user.$inferSelect, 'id' | 'image' | 'name' | 'verified'>;

// export type PostLikes = { id: typeof like.$inferSelect.id; author: Author }[];
export type PostLikes = Array<Pick<typeof like.$inferSelect, 'createdAt' | 'id'> & { author: Author }>;

export type PostReposts = PostLikes;
