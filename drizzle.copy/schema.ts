import {
	pgTable,
	varchar,
	timestamp,
	text,
	integer,
	check,
	uniqueIndex,
	index,
	foreignKey,
	boolean,
	serial,
	pgView,
	pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const appointmentStatus = pgEnum('AppointmentStatus', [
	'PENDING',
	'CONFIRMED',
	'COMPLETED',
	'CANCELLED_BY_CLIENT',
	'CANCELLED_BY_PROVIDER'
]);
export const dayOfWeek = pgEnum('DayOfWeek', [
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
	'SUNDAY'
]);
export const servicesLocation = pgEnum('ServicesLocation', [
	'PROVIDER_LOCATION',
	'CLIENT_HOME',
	'BOTH'
]);

export const prismaMigrations = pgTable('_prisma_migrations', {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
	migrationName: varchar('migration_name', { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp('rolled_back_at', { withTimezone: true, mode: 'string' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer('applied_steps_count').default(0).notNull()
});

export const spatialRefSys = pgTable(
	'spatial_ref_sys',
	{
		srid: integer().primaryKey().notNull(),
		authName: varchar('auth_name', { length: 256 }),
		authSrid: integer('auth_srid'),
		srtext: varchar({ length: 2048 }),
		proj4Text: varchar({ length: 2048 })
	},
	(table) => [check('spatial_ref_sys_srid_check', sql`(srid > 0) AND (srid <= 998999)`)]
);

export const user = pgTable(
	'User',
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		email: text().notNull(),
		emailVerified: timestamp({ precision: 3, mode: 'string' }),
		image: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull()
	},
	(table) => [
		uniqueIndex('User_email_key').using('btree', table.email.asc().nullsLast().op('text_ops'))
	]
);

export const providerProfile = pgTable(
	'ProviderProfile',
	{
		id: text().primaryKey().notNull(),
		bio: text(),
		yearsOfExperience: integer().default(0).notNull(),
		isActive: boolean().default(false).notNull(),
		serviceLocationType: servicesLocation().notNull(),
		address: text(),
		userId: text().notNull(),
		locationId: integer().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull()
	},
	(table) => [
		index('ProviderProfile_locationId_idx').using(
			'btree',
			table.locationId.asc().nullsLast().op('int4_ops')
		),
		uniqueIndex('ProviderProfile_locationId_key').using(
			'btree',
			table.locationId.asc().nullsLast().op('int4_ops')
		),
		uniqueIndex('ProviderProfile_userId_key').using(
			'btree',
			table.userId.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'ProviderProfile_userId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.locationId],
			foreignColumns: [location.id],
			name: 'ProviderProfile_locationId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const location = pgTable('Location', {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	// TODO: failed to parse database type 'geography'
	coordinates: unknown('coordinates').notNull()
});

export const providerService = pgTable(
	'ProviderService',
	{
		id: text().primaryKey().notNull(),
		providerProfileId: text().notNull(),
		serviceId: integer().notNull(),
		priceFrom: integer().notNull(),
		priceTo: integer().notNull(),
		isAvailable: boolean().default(true).notNull()
	},
	(table) => [
		uniqueIndex('ProviderService_providerProfileId_serviceId_key').using(
			'btree',
			table.providerProfileId.asc().nullsLast().op('int4_ops'),
			table.serviceId.asc().nullsLast().op('int4_ops')
		),
		foreignKey({
			columns: [table.providerProfileId],
			foreignColumns: [providerProfile.id],
			name: 'ProviderService_providerProfileId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.serviceId],
			foreignColumns: [service.id],
			name: 'ProviderService_serviceId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const service = pgTable(
	'Service',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		description: text()
	},
	(table) => [
		uniqueIndex('Service_name_key').using('btree', table.name.asc().nullsLast().op('text_ops'))
	]
);

export const veterinarianDetails = pgTable(
	'VeterinarianDetails',
	{
		id: text().primaryKey().notNull(),
		providerProfileId: text().notNull(),
		licenceNumber: text().notNull(),
		specialties: text().array()
	},
	(table) => [
		uniqueIndex('VeterinarianDetails_providerProfileId_key').using(
			'btree',
			table.providerProfileId.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.providerProfileId],
			foreignColumns: [providerProfile.id],
			name: 'VeterinarianDetails_providerProfileId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const psychologistDetails = pgTable(
	'PsychologistDetails',
	{
		id: text().primaryKey().notNull(),
		providerProfileId: text().notNull(),
		licenseNumber: text().notNull(),
		therapeuticApproaches: text().array()
	},
	(table) => [
		uniqueIndex('PsychologistDetails_providerProfileId_key').using(
			'btree',
			table.providerProfileId.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.providerProfileId],
			foreignColumns: [providerProfile.id],
			name: 'PsychologistDetails_providerProfileId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const clientProfile = pgTable(
	'ClientProfile',
	{
		id: text().primaryKey().notNull(),
		userId: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => [
		uniqueIndex('ClientProfile_userId_key').using(
			'btree',
			table.userId.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'ClientProfile_userId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const appointment = pgTable(
	'Appointment',
	{
		id: text().primaryKey().notNull(),
		clientProfileId: text().notNull(),
		providerServiceId: text().notNull(),
		appointmentTime: timestamp({ precision: 3, mode: 'string' }).notNull(),
		status: appointmentStatus().default('PENDING').notNull(),
		priceAtBooking: integer().notNull(),
		notesForProvider: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.clientProfileId],
			foreignColumns: [clientProfile.id],
			name: 'Appointment_clientProfileId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.providerServiceId],
			foreignColumns: [providerService.id],
			name: 'Appointment_providerServiceId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const review = pgTable(
	'Review',
	{
		id: text().primaryKey().notNull(),
		appointmentId: text().notNull(),
		rating: integer().notNull(),
		comment: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => [
		uniqueIndex('Review_appointmentId_key').using(
			'btree',
			table.appointmentId.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.appointmentId],
			foreignColumns: [appointment.id],
			name: 'Review_appointmentId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);

export const providerAvailability = pgTable(
	'ProviderAvailability',
	{
		id: serial().notNull(),
		providerProfileId: text().notNull(),
		day: dayOfWeek().notNull(),
		startTime: timestamp({ precision: 3, mode: 'string' }).notNull(),
		endTime: timestamp({ precision: 3, mode: 'string' }).notNull()
	},
	(table) => [
		uniqueIndex('ProviderAvailability_providerProfileId_day_startTime_endTim_key').using(
			'btree',
			table.providerProfileId.asc().nullsLast().op('text_ops'),
			table.day.asc().nullsLast().op('text_ops'),
			table.startTime.asc().nullsLast().op('timestamp_ops'),
			table.endTime.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.providerProfileId],
			foreignColumns: [providerProfile.id],
			name: 'ProviderAvailability_providerProfileId_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	]
);
export const geographyColumns = pgView('geography_columns', {
	// TODO: failed to parse database type 'name'
	fTableCatalog: unknown('f_table_catalog'),
	// TODO: failed to parse database type 'name'
	fTableSchema: unknown('f_table_schema'),
	// TODO: failed to parse database type 'name'
	fTableName: unknown('f_table_name'),
	// TODO: failed to parse database type 'name'
	fGeographyColumn: unknown('f_geography_column'),
	coordDimension: integer('coord_dimension'),
	srid: integer(),
	type: text()
}).as(
	sql`SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`
);

export const geometryColumns = pgView('geometry_columns', {
	fTableCatalog: varchar('f_table_catalog', { length: 256 }),
	// TODO: failed to parse database type 'name'
	fTableSchema: unknown('f_table_schema'),
	// TODO: failed to parse database type 'name'
	fTableName: unknown('f_table_name'),
	// TODO: failed to parse database type 'name'
	fGeometryColumn: unknown('f_geometry_column'),
	coordDimension: integer('coord_dimension'),
	srid: integer(),
	type: varchar({ length: 30 })
}).as(
	sql`SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(split_part(s.consrc, ''''::text, 2), ')'::text, ''::text) AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%geometrytype(% = %'::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text)::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%ndims(% = %'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text), '('::text, ''::text)::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%srid(% = %'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`
);
