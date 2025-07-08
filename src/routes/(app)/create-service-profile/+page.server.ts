import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/drizzle';
import { service, serviceProfile, type ModalityType } from '$lib/server/drizzle/schema';
import z from 'zod';
import { auth } from '$lib/server/auth';

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

const FormSchema = z.object({
	serviceId: z.string(),
	modalities: z.array(z.custom<ModalityType>()),
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
	}),
	bio: z.string(),
	yearsOfExperience: z
		.string()
		.refine((val) => !isNaN(Number(val)), { message: 'Los años de experiencia debe ser un número' })
		.transform((val) => Number(val)),
	prices: z.array(
		z
			.number()
			.refine((val) => !isNaN(Number(val)), { message: 'Los precios deben ser un números' })
			.transform((val) => Number(val))
	)
});

export const actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const serviceId = form.get('serviceId') as string;
		const modalities = JSON.parse(form.get('selectedModalities') as string);
		const address = JSON.parse(form.get('selectedAddress') as string);
		const bio = form.get('bio');
		const yearsOfExperience = form.get('yearsOfExperience');
		const prices = JSON.parse(form.get('prices') as string);

		try {
			const session = await auth.api.getSession({
				headers: request.headers
			});

			if (!session || !session.user) {
				return fail(400, { message: 'User not found' });
			}

			console.log({ serviceId, modalities, address, bio, yearsOfExperience, prices });

			const { data, success, error } = FormSchema.safeParse({
				serviceId,
				modalities,
				address,
				bio,
				yearsOfExperience,
				prices
			});

			console.log({ data, success, error });

			if (!success) {
				return fail(400, {
					error: !success
				});
			}

			await db.insert(serviceProfile).values({
				userId: session.user.id,
				location: {
					x: data.address.coordinates[0],
					y: data.address.coordinates[1]
				},
				modalityType: data.modalities,
				priceFrom: data.prices[0],
				priceTo: data.prices[1],
				address: data.address.fullAddress,
				bio: data.bio,
				yearsOfExperience: data.yearsOfExperience,
				serviceId: data.serviceId
			});

			return {
				success: true
			};
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
