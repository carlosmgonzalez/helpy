import type { Location } from '$lib/interfaces/location-prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
	model: {
		location: {
			async create(data: { name: string; latitude: number; longitude: number }) {
				const poi: Location = {
					name: data.name,
					coordinates: {
						latitude: data.latitude,
						longitude: data.longitude
					}
				};

				const point = `POINT(${poi.coordinates.longitude} ${poi.coordinates.latitude})`;
				await prisma.$queryRaw`
          INSERT INTO "location" (name, coordinates) VALUES (${poi.name}, ST_GeomFromText(${point}, 4326));
        `;

				return poi;
			},
			async findClosestPoints(latitude: number, longitude: number) {
				// Query for clostest points of interests
				const result = await prisma.$queryRaw<
					{
						id: number | null;
						name: string | null;
						st_x: number | null;
						st_y: number | null;
					}[]
				>`SELECT id, name, ST_X(location::geometry), ST_Y(location::geometry) 
              FROM "location" 
              ORDER BY ST_DistanceSphere(location::geometry, ST_MakePoint(${longitude}, ${latitude})) DESC`;

				// Transform to our custom type
				const pois: Location[] = result.map((data) => {
					return {
						name: data.name || '',
						coordinates: {
							latitude: data.st_x || 0,
							longitude: data.st_y || 0
						}
					};
				});

				// Return data
				return pois;
			}
		}
	}
});

export default prisma;
