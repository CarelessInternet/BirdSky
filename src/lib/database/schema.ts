import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, index, foreignKey, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	verified: boolean('verified').default(false).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
	posts: many(post),
}));

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export const post = pgTable(
	'post',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`uuidv7()`),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		userAgent: text('user_agent'),
		content: text('content'),
		// Reposts.
		originalPostId: uuid('original_post_id'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.originalPostId],
			foreignColumns: [table.id],
		}),
		index().on(table.userId),
		index().on(table.originalPostId),
	],
);

export const postRelations = relations(post, ({ one, many }) => ({
	author: one(user, { fields: [post.userId], references: [user.id] }),
	likes: many(like),
	replies: many(reply),
	reposts: many(post, {
		// Child-side: posts that reference this post via originalPostId.
		relationName: 'reposts',
	}),
	originalPost: one(post, {
		fields: [post.originalPostId],
		references: [post.id],
		relationName: 'reposts',
	}),
}));

export const like = pgTable(
	'like',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`uuidv7()`),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		userAgent: text('user_agent'),
		postId: uuid('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [index().on(table.userId), index().on(table.postId)],
);

export const likeRelations = relations(like, ({ one }) => ({
	author: one(user, { fields: [like.userId], references: [user.id] }),
	post: one(post, { fields: [like.postId], references: [post.id] }),
}));

export const reply = pgTable(
	'reply',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`uuidv7()`),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		userAgent: text('user_agent'),
		content: text('content').notNull(),
		postId: uuid('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		// Nested replies.
		parentReplyId: uuid('parent_reply_id'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentReplyId],
			foreignColumns: [table.id],
		}),
		index().on(table.userId),
		index().on(table.postId),
		index().on(table.parentReplyId),
	],
);

export const replyRelations = relations(reply, ({ one, many }) => ({
	author: one(user, { fields: [reply.userId], references: [user.id] }),
	likes: many(replyLike),
}));

export const replyLike = pgTable(
	'reply_like',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`uuidv7()`),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		userAgent: text('user_agent'),
		replyId: uuid('reply_id')
			.notNull()
			.references(() => reply.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [index().on(table.userId), index().on(table.replyId)],
);

export const replyLikeRelations = relations(replyLike, ({ one }) => ({
	author: one(user, { fields: [replyLike.userId], references: [user.id] }),
	reply: one(post, { fields: [replyLike.replyId], references: [post.id] }),
}));
