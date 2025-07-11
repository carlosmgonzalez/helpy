import db from '$lib/server/drizzle';
import { clientProfile } from '$lib/server/drizzle/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';

const BodySchema = z.object({
	clientProfileId: z.string(),
	address: z.object({
		id: z.string(),
		coordinates: z.array(
			z
				.number()
				.refine((val) => !isNaN(Number(val)), {
					message: 'Los coordenadas de experiencia debe ser un número'
				})
				.transform((val) => Number(val))
		),
		fullAddress: z.string()
	})
});

export const PATCH: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		const { data, success, error: err } = BodySchema.safeParse(body);

		if (!success) return json({ err });

		await db
			.update(clientProfile)
			.set({
				location: {
					x: data.address.coordinates[0],
					y: data.address.coordinates[1]
				},
				address: data.address.fullAddress
			})
			.where(eq(clientProfile.id, data.clientProfileId));

		return json({ ok: true });
	} catch (err) {
		console.log(err);
		return error(500, { message: 'Somethin went wrong try change address' });
	}
};
