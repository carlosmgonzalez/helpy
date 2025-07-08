import { relations } from 'drizzle-orm';
import {
	primaryKey,
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

export const modality = pgEnum('service_modality', ['service_location', 'client_home', 'online']);
export type ModalityType = (typeof modality.enumValues)[number];

export const user = pgTable(
	'user',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		emailVerified: boolean('email_verified')
			.$defaultFn(() => false)
			.notNull(),
		image: text('image'),
		createdAt: timestamp('created_at')
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp('updated_at')
			.$defaultFn(() => new Date())
			.notNull()
	},
	(t) => [uniqueIndex('email_idx').on(t.email)]
);

export const userRelation = relations(user, ({ one }) => ({
	providerProfile: one(serviceProfile)
}));

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => new Date())
});

export const service = pgTable('service', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	description: text('description')
});

export const serviceRelation = relations(service, ({ many }) => ({
	serviceProfile: many(serviceProfile),
	clientServiceInterest: many(clientServiceInterest)
}));

export const serviceProfile = pgTable(
	'service_profile',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		bio: text('bio'),
		priceFrom: integer('price_from').default(0).notNull(),
		priceTo: integer('price_to').notNull(),
		yearsOfExperience: integer('years_of_experience').default(0).notNull(),
		isActive: boolean('is_active').default(false).notNull(),
		modalityType: modality('modality_type').array().notNull(),
		address: text('address'),
		location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
		userId: text('user_id').notNull(),
		serviceId: uuid('service_id')
			.references(() => service.id, { onDelete: 'cascade' })
			.notNull()
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

export const serviceProfileRelation = relations(serviceProfile, ({ one }) => ({
	user: one(user, {
		fields: [serviceProfile.userId],
		references: [user.id]
	}),
	service: one(service, {
		fields: [serviceProfile.serviceId],
		references: [service.id]
	})
}));

export const clientProfile = pgTable('client_profile', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('user_id')
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull()
});

export const clientProfileRelation = relations(clientProfile, ({ many }) => ({
	clientServiceInterest: many(clientServiceInterest)
}));

export const clientServiceInterest = pgTable(
	'client_service_interest',
	{
		clientProfileId: uuid('client_profile_id')
			.references(() => clientProfile.id, { onDelete: 'cascade' })
			.notNull(),
		serviceId: uuid('service_id')
			.references(() => service.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [primaryKey({ columns: [t.clientProfileId, t.serviceId] })]
);

export const clientServiceInterestRelation = relations(clientServiceInterest, ({ one }) => ({
	clientProfile: one(clientProfile, {
		fields: [clientServiceInterest.clientProfileId],
		references: [clientProfile.id]
	}),
	service: one(service, {
		fields: [clientServiceInterest.serviceId],
		references: [service.id]
	})
}));

export const appointment = pgTable('appointment', {
	id: uuid('id').defaultRandom().primaryKey(),
	clientProfileId: uuid('client_profile_id')
		.references(() => clientProfile.id, { onDelete: 'cascade' })
		.notNull(),
	serviceProfileId: uuid('service_profile_id')
		.references(() => serviceProfile.id, { onDelete: 'cascade' })
		.notNull(),
	status: appointmentStatus('status').default('pending'),
	priceAtBookin: integer('price_at_bookin').notNull(),
	appointmentTime: timestamp('appointment_time', { precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' }).notNull().defaultNow()
});
