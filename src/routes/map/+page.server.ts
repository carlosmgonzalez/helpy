import db from '$lib/server/drizzle';
import { serviceProfile, user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const users = await db
			.select()
			.from(user)
			.innerJoin(serviceProfile, eq(user.id, serviceProfile.userId));

		return {
			users
		};
	} catch (error) {
		console.log(error);
	}
};
