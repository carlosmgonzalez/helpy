import { ServicesLocation } from '@prisma/client';

export const users = [
	{
		id: '9ea0c661-7b68-4b7b-85e1-64a3da852033',
		name: 'Juan David',
		email: 'juandavid@gmail.com'
	}
];

export const providersProfiles = [
	{
		id: 'acce45c6-bb8e-4610-9297-9b227755f705',
		userId: '9ea0c661-7b68-4b7b-85e1-64a3da852033',
		bio: 'Mucho gusto, soy un veterinario experto en gatos',
		yearsOfExperience: 10,
		serviceLocationType: ServicesLocation.CLIENT_HOME,
		address: 'Rodriquez pena 208',
		lat: 50,
		lon: 50
	}
];

export const locations = [
	{
		id: '149ca859-c384-41d9-a0dc-b5aaadcf2a37'
	}
];
