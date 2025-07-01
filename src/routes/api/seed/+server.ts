import { providersProfilesSeed, usersSeed } from '$lib/database/seed';
import db from '$lib/server/drizzle';
import { providerProfile, user, type ServicesLocationType } from '$lib/server/drizzle/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		await Promise.all(
			usersSeed.map((data) =>
				db.insert(user).values({
					id: data.id,
					name: data.name,
					email: data.email
				})
			)
		);

		await Promise.all(
			providersProfilesSeed.map((data) =>
				db.insert(providerProfile).values({
					id: data.id,
					userId: data.userId,
					location: {
						x: data.location.x,
						y: data.location.y
					},
					address: data.address,
					bio: data.bio,
					yearsOfExperience: data.yearsOfExperience,
					serviceLocationType: data.serviceLocationType as ServicesLocationType
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
