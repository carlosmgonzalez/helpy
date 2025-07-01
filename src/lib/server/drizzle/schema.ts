import { relations } from 'drizzle-orm';
import {
	boolean,
	foreignKey,
	geometry,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const appointmentStatus = pgEnum('appointment_status', [
	'pending',
	'confirmed',
	'completed',
	'cancelled_by_client',
	'cancelled_by_provider'
]);

export const dayOfWeek = pgEnum('day_of_week', [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday'
]);

export const servicesLocation = pgEnum('services_location', [
	'provider_location',
	'client_home',
	'online'
]);
export type ServicesLocationType = (typeof servicesLocation.enumValues)[number];

export const user = pgTable(
	'user',
	{
		id: uuid().defaultRandom().primaryKey(),
		name: varchar({ length: 255 }).notNull(),
		email: varchar({ length: 255 }).unique().notNull(),
		emailVerified: timestamp({ precision: 3, mode: 'string' }),
		image: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' }).notNull().defaultNow(),
		updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('email_idx').on(table.email)]
);

export const service = pgTable('service', {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).unique(),
	description: text()
});

export const providerProfile = pgTable(
	'provider_profile',
	{
		id: uuid().defaultRandom().primaryKey(),
		bio: text(),
		yearsOfExperience: integer().default(0).notNull(),
		isActive: boolean().default(false).notNull(),
		serviceLocationType: servicesLocation().notNull(),
		address: text(),
		userId: uuid().notNull(),
		location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' }).notNull().defaultNow(),
		updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull().defaultNow()
	},
	(t) => [
		index('spatial_index').using('gist', t.location),
		foreignKey({
			columns: [t.userId],
			foreignColumns: [user.id],
			name: 'providerProfile_userId_fkey'
		}).onDelete('cascade')
	]
);

export const providerProfileRelations = relations(providerProfile, ({ one }) => ({
	user: one(user, {
		fields: [providerProfile.userId],
		references: [user.id]
	})
}));

export const providerService = pgTable('provider_service', {
	id: uuid().primaryKey().defaultRandom(),
	providerProfileId: uuid()
		.notNull()
		.references(() => providerProfile.id, { onDelete: 'cascade' }),
	serviceId: uuid()
		.notNull()
		.references(() => service.id, { onDelete: 'cascade' }),
	priceFrom: integer().default(0),
	priceTo: integer().notNull(),
	isAvailable: boolean().default(true)
});
