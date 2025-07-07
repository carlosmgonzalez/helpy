import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/drizzle';
import { service } from '$lib/server/drizzle/schema';

export const load: PageServerLoad = async () => {
	try {
		const services = await db.select().from(service);

		return {
			services
		};
	} catch (error) {
		console.log(error);
		return {
			services: []
		};
	}
};

export const actions = {} satisfies Actions;
