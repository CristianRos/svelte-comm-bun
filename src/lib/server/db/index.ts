import { env } from '$env/dynamic/private';
import * as schema from './schema'
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new Pool({
    connectionString: env.DATABASE_URL
})

export const db = drizzle(pool, { schema });
