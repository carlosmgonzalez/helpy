import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';

const db = drizzle(DATABASE_URL);
export default db;
