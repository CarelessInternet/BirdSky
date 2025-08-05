// Using bun-sql causes too many connections as of v1.2.19.
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { env } from '~/env';

export const database = drizzle({ connection: env.POSTGRES_DATABASE_URL, schema });
