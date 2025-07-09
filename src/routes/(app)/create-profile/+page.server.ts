import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/drizzle';
import {
	clientProfile,
	clientServiceInterest,
	service,
	serviceProfile,
	type ModalityType
} from '$lib/server/drizzle/schema';
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

const FormServiceSchema = z.object({
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
	priceFrom: z
		.string()
		.refine((val) => !isNaN(Number(val)), { message: 'Los precios deben ser un números' })
		.transform((val) => Number(val)),
	priceTo: z
		.string()
		.refine((val) => !isNaN(Number(val)), { message: 'Los precios deben ser un números' })
		.transform((val) => Number(val))
});

const FormClientSchema = z.object({
	serviceId: z.string(),
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

export const actions = {
	createServiceProfile: async ({ request }) => {
		const form = await request.formData();
		const serviceId = form.get('serviceId') as string;
		const modalities = JSON.parse(form.get('selectedModalities') as string);
		const address = JSON.parse(form.get('selectedAddress') as string);
		const bio = form.get('bio');
		const yearsOfExperience = form.get('yearsOfExperience');
		const priceFrom = form.get('priceFrom');
		const priceTo = form.get('priceTo');

		try {
			const session = await auth.api.getSession({
				headers: request.headers
			});

			if (!session || !session.user) {
				return fail(400, { message: 'User not found' });
			}

			const { data, success } = FormServiceSchema.safeParse({
				serviceId,
				modalities,
				address,
				bio,
				yearsOfExperience,
				priceFrom,
				priceTo
			});

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
				priceFrom: data.priceFrom,
				priceTo: data.priceTo,
				address: data.address.fullAddress,
				bio: data.bio,
				yearsOfExperience: data.yearsOfExperience,
				serviceId: data.serviceId
			});
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'No se pudo crear el perfil. Por favor, inténtalo de nuevo.' });
		}

		return redirect(308, '/');
	},
	createProfileClient: async ({ request }) => {
		const form = await request.formData();
		const serviceId = form.get('serviceId') as string;
		const address = JSON.parse(form.get('selectedAddress') as string);

		try {
			const session = await auth.api.getSession({
				headers: request.headers
			});

			if (!session || !session.user) {
				return fail(400, { message: 'User not found' });
			}

			const { data, success } = FormClientSchema.safeParse({
				serviceId,
				address
			});

			if (!success) {
				return fail(400, {
					errorClient: !success
				});
			}

			const client = await db
				.insert(clientProfile)
				.values({
					userId: session.user.id,
					location: {
						x: data.address.coordinates[0],
						y: data.address.coordinates[1]
					},
					address: data.address.fullAddress
				})
				.returning();

			await db.insert(clientServiceInterest).values({
				clientProfileId: client[0].id,
				serviceId: data.serviceId
			});
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'No se pudo crear el perfil. Por favor, inténtalo de nuevo.' });
		}

		return redirect(308, '/map');
	}
} satisfies Actions;
