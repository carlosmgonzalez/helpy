import db from '$lib/server/drizzle';
import { clientProfile, service, serviceProfile, user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, depends }) => {
	depends('app:load-map');

	const { session } = await parent();

	const client = await db.query.clientProfile.findFirst({
		where: eq(clientProfile.userId, session.user.id),
		with: {
			clientServiceInterest: {
				orderBy: (fields, { desc }) => [desc(fields.updatedAt)],
				limit: 1
			}
		}
	});

	if (!client) redirect(307, '/create-profile');

	try {
		const serviceOfInterest = await db
			.select()
			.from(serviceProfile)
			.where(eq(serviceProfile.serviceId, client!.clientServiceInterest[0].serviceId))
			.innerJoin(user, eq(serviceProfile.userId, user.id))
			.innerJoin(service, eq(serviceProfile.serviceId, service.id));

		return {
			client,
			serviceOfInterest
		};
	} catch (error) {
		console.log(error);
	}
};
