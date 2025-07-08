import { serviceProfilesSeed, servicesSeed } from '$lib/database/seed';
import db from '$lib/server/drizzle';
import { serviceProfile, service, type ModalityType } from '$lib/server/drizzle/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		await Promise.all([db.delete(service), db.delete(serviceProfile)]);

		// await Promise.all(
		// 	usersSeed.map((data) =>
		// 		db.insert(user).values({
		// 			id: data.id,
		// 			name: data.name,
		// 			email: data.email,
		// 			image: data.image
		// 		})
		// 	)
		// );

		await Promise.all(
			serviceProfilesSeed.map((data) =>
				db.insert(serviceProfile).values({
					id: data.id,
					userId: data.userId,
					location: sql`ST_SetSRID(ST_MakePoint(${data.location.x}, ${data.location.y}), 4326)`,
					address: data.address,
					bio: data.bio,
					yearsOfExperience: data.yearsOfExperience,
					modalityType: data.modalityType as ModalityType[],
					priceTo: data.priceTo,
					priceFrom: data.priceFrom
				})
			)
		);

		await Promise.all(
			servicesSeed.map((data) =>
				db.insert(service).values({
					id: data.id,
					name: data.name,
					description: data.description
				})
			)
		);

		return json({
			ok: true,
			message: 'Seed executed'
		});
	} catch (e) {
		console.error(e);
		return error(400, {
			message: 'Something went wrong while executed seed'
		});
	}
};
