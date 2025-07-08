import db from '$lib/server/drizzle';
import { clientProfile, serviceProfile, user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	try {
		const { session } = await parent();

		const initialData = await db
			.select()
			.from(user)
			.innerJoin(serviceProfile, eq(user.id, serviceProfile.userId));

		// const client = await db
		// 	.select()
		// 	.from(clientProfile)
		// 	.where(eq(clientProfile.userId, session.user.id))
		// 	.leftJoin(clientServiceInterest, eq(clientProfile.id, clientServiceInterest.clientProfileId))

		const client = await db.query.clientProfile.findFirst({
			where: eq(clientProfile.userId, session.user.id),
			with: {
				clientServiceInterest: {
					orderBy: (fields, { desc }) => [desc(fields.updatedAt)],
					limit: 1
				}
			}
		});

		return {
			initialData,
			client
		};
	} catch (error) {
		console.log(error);
	}
};
