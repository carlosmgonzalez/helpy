import db from '$lib/server/drizzle';
import { serviceProfile, user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const initialData = await db
			.select()
			.from(user)
			.innerJoin(serviceProfile, eq(user.id, serviceProfile.userId));

		return {
			initialData
		};
	} catch (error) {
		console.log(error);
	}
};
