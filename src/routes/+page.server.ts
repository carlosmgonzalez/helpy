import db from '$lib/server/drizzle';
import { providerProfile, user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const data = await db
			.select()
			.from(user)
			.leftJoin(providerProfile, eq(user.id, providerProfile.userId));

		return {
			initialData: data
		};
	} catch (error) {
		console.log(error);
	}
};
