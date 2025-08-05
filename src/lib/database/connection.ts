import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { env } from '~/env';

export const database = drizzle({ connection: env.POSTGRES_DATABASE_URL, schema });
