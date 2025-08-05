import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { env } from '~/env';
import { database } from '~/lib/database/connection';
import * as schema from '~/lib/database/schema';

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(database, {
		provider: 'pg',
		schema: {
			...schema,
		},
	}),
	plugins: [nextCookies()],
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	user: {
		additionalFields: {
			verified: {
				type: 'boolean',
				required: true,
				defaultValue: false,
				input: false,
			},
		},
	},
});
