export const usersSeed = [
	{
		id: '9ea0c661-7b68-4b7b-85e1-64a3da852033',
		name: 'Juan David',
		email: 'juandavid@gmail.com'
	},
	{
		id: 'b1a1c661-7b68-4b7b-85e1-64a3da852034',
		name: 'Maria Lopez',
		email: 'marialopez@gmail.com'
	},
	{
		id: 'c2b2d661-8c79-5c8c-96f2-75b4eb963145',
		name: 'Carlos Perez',
		email: 'carlosperez@hotmail.com'
	},
	{
		id: 'd3c3e661-9d8a-6d9d-a7f3-86c5fc074256',
		name: 'Ana Torres',
		email: 'anatorres@yahoo.com'
	},
	{
		id: 'e4d4f661-0e9b-7e0e-b8f4-97d6ad185367',
		name: 'Luis Martinez',
		email: 'luismartinez@outlook.com'
	}
];

export const providersProfilesSeed = [
	{
		id: 'acce45c6-bb8e-4610-9297-9b227755f705',
		userId: '9ea0c661-7b68-4b7b-85e1-64a3da852033',
		bio: 'Mucho gusto, soy un veterinario experto en gatos',
		yearsOfExperience: 10,
		serviceLocationType: 'client_home',
		address: 'Rodriquez pena 208',
		location: {
			x: -34.604440605527486,
			y: -58.39814487504126
		}
	},
	{
		id: 'b2b2c661-7b68-4b7b-85e1-64a3da852035',
		userId: 'b1a1c661-7b68-4b7b-85e1-64a3da852034',
		bio: 'Soy paseadora de perros con experiencia en adiestramiento canino',
		yearsOfExperience: 5,
		serviceLocationType: 'client_home',
		address: 'Av. Corrientes 1234',
		location: {
			x: -34.603684,
			y: -58.381559
		}
	},
	{
		id: 'c3c3d661-8c79-5c8c-96f2-75b4eb963146',
		userId: 'c2b2d661-8c79-5c8c-96f2-75b4eb963145',
		bio: 'Entrenador de mascotas especializado en obediencia básica',
		yearsOfExperience: 8,
		serviceLocationType: 'client_home',
		address: 'San Martín 567',
		location: {
			x: -34.601242,
			y: -58.386149
		}
	},
	{
		id: 'd4d4e661-9d8a-6d9d-a7f3-86c5fc074257',
		userId: 'd3c3e661-9d8a-6d9d-a7f3-86c5fc074256',
		bio: 'Peluquera canina y felina, trato amoroso y profesional',
		yearsOfExperience: 6,
		serviceLocationType: 'client_home',
		address: 'Belgrano 890',
		location: {
			x: -34.599887,
			y: -58.377234
		}
	},
	{
		id: 'e5e5f661-0e9b-7e0e-b8f4-97d6ad185368',
		userId: 'e4d4f661-0e9b-7e0e-b8f4-97d6ad185367',
		bio: 'Veterinario especializado en animales exóticos',
		yearsOfExperience: 12,
		serviceLocationType: 'client_home',
		address: 'Mitre 321',
		location: {
			x: -34.607123,
			y: -58.392456
		}
	}
];
