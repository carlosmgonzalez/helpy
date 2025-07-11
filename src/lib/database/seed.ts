export const usersSeed = [
	{
		id: '9ea0c661-7b68-4b7b-85e1-64a3da852033',
		name: 'Juan David',
		email: 'juandavid@gmail.com',
		image: 'https://api.dicebear.com/9.x/adventurer/svg?seed=juanDavid'
	},
	{
		id: 'b1a1c661-7b68-4b7b-85e1-64a3da852034',
		name: 'Maria Lopez',
		email: 'marialopez@gmail.com',
		image: 'https://api.dicebear.com/9.x/adventurer/svg?seed=mariaLopez'
	},
	{
		id: 'c2b2d661-8c79-5c8c-96f2-75b4eb963145',
		name: 'Carlos Perez',
		email: 'carlosperez@hotmail.com',
		image: 'https://api.dicebear.com/9.x/adventurer/svg?seed=carlosPerez'
	},
	{
		id: 'd3c3e661-9d8a-6d9d-a7f3-86c5fc074256',
		name: 'Ana Torres',
		email: 'anatorres@yahoo.com',
		image: 'https://api.dicebear.com/9.x/adventurer/svg?seed=anaTorres'
	},
	{
		id: 'e4d4f661-0e9b-7e0e-b8f4-97d6ad185367',
		name: 'Luis Martinez',
		email: 'luismartinez@outlook.com',
		image: 'https://api.dicebear.com/9.x/adventurer/svg?seed=luisMartinez'
	}
];

export const providersProfilesSeed = [
	{
		id: 'c3c3d661-8c79-5c8c-96f2-75b4eb963146',
		userId: 'c2b2d661-8c79-5c8c-96f2-75b4eb963145',
		bio: 'Entrenador de mascotas especializado en obediencia básica',
		yearsOfExperience: 8,
		modalityType: ['client_home'],
		address: 'San Martín 567',
		location: {
			x: -58.408282764082635,
			y: -34.59818849657023
		},
		priceFrom: 90,
		priceTo: 130
	},
	{
		id: 'acce45c6-bb8e-4610-9297-9b227755f705',
		userId: '9ea0c661-7b68-4b7b-85e1-64a3da852033',
		bio: 'Mucho gusto, soy un veterinario experto en gatos',
		yearsOfExperience: 10,
		modalityType: ['client_home'],
		address: 'Rodriquez pena 208',
		location: {
			x: -58.3900844196679,
			y: -34.60400777700297
		},
		priceFrom: 90,
		priceTo: 130
	},
	{
		id: 'b2b2c661-7b68-4b7b-85e1-64a3da852035',
		userId: 'b1a1c661-7b68-4b7b-85e1-64a3da852034',
		bio: 'Soy paseadora de perros con experiencia en adiestramiento canino',
		yearsOfExperience: 5,
		modalityType: ['client_home'],
		address: 'Av. Corrientes 1234',
		location: {
			x: -58.39639478409676,
			y: -34.6075467901436
		},
		priceFrom: 90,
		priceTo: 130
	},
	{
		id: 'd4d4e661-9d8a-6d9d-a7f3-86c5fc074257',
		userId: 'd3c3e661-9d8a-6d9d-a7f3-86c5fc074256',
		bio: 'Peluquera canina y felina, trato amoroso y profesional',
		yearsOfExperience: 6,
		modalityType: ['client_home'],
		address: 'Belgrano 890',
		location: {
			x: -58.41779540651727,
			y: -34.601544882745614
		},
		priceFrom: 90,
		priceTo: 130
	},
	{
		id: 'e5e5f661-0e9b-7e0e-b8f4-97d6ad185368',
		userId: 'e4d4f661-0e9b-7e0e-b8f4-97d6ad185367',
		bio: 'Veterinario especializado en animales exóticos',
		yearsOfExperience: 12,
		modalityType: ['client_home'],
		address: 'Mitre 321',
		location: {
			x: -58.41447651951197,
			y: -34.58497882526042
		},
		priceFrom: 90,
		priceTo: 130
	}
];

export const servicesSeed = [
	{
		id: 'f1e2d3c4-b5a6-4789-8cde-1234567890ab',
		name: 'Veterinario',
		description: 'Servicios veterinarios para mascotas domésticas y exóticas.'
	},
	{
		id: 'a2b3c4d5-e6f7-4890-9abc-2345678901bc',
		name: 'Psicólogo',
		description: 'Atención psicológica profesional.'
	}
];
