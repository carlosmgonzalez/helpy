import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';

const sql = neon(DATABASE_URL);

const db = drizzle({
	client: sql,
	schema
});

export default db;
