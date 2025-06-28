import { users } from '$lib/database/seed';
import prisma from '$lib/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	await Promise.all(
		users.map((user) =>
			prisma.user.create({
				data: {
					id: user.id,
					name: user.name,
					email: user.email
				}
			})
		)
	);

	return json({
		ok: true,
		message: 'Seed executed'
	});
};
