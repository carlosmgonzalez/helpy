import { relations } from "drizzle-orm/relations";
import { user, providerProfile, location, providerService, service, veterinarianDetails, psychologistDetails, clientProfile, appointment, review, providerAvailability } from "./schema";

export const providerProfileRelations = relations(providerProfile, ({one, many}) => ({
	user: one(user, {
		fields: [providerProfile.userId],
		references: [user.id]
	}),
	location: one(location, {
		fields: [providerProfile.locationId],
		references: [location.id]
	}),
	providerServices: many(providerService),
	veterinarianDetails: many(veterinarianDetails),
	psychologistDetails: many(psychologistDetails),
	providerAvailabilities: many(providerAvailability),
}));

export const userRelations = relations(user, ({many}) => ({
	providerProfiles: many(providerProfile),
	clientProfiles: many(clientProfile),
}));

export const locationRelations = relations(location, ({many}) => ({
	providerProfiles: many(providerProfile),
}));

export const providerServiceRelations = relations(providerService, ({one, many}) => ({
	providerProfile: one(providerProfile, {
		fields: [providerService.providerProfileId],
		references: [providerProfile.id]
	}),
	service: one(service, {
		fields: [providerService.serviceId],
		references: [service.id]
	}),
	appointments: many(appointment),
}));

export const serviceRelations = relations(service, ({many}) => ({
	providerServices: many(providerService),
}));

export const veterinarianDetailsRelations = relations(veterinarianDetails, ({one}) => ({
	providerProfile: one(providerProfile, {
		fields: [veterinarianDetails.providerProfileId],
		references: [providerProfile.id]
	}),
}));

export const psychologistDetailsRelations = relations(psychologistDetails, ({one}) => ({
	providerProfile: one(providerProfile, {
		fields: [psychologistDetails.providerProfileId],
		references: [providerProfile.id]
	}),
}));

export const clientProfileRelations = relations(clientProfile, ({one, many}) => ({
	user: one(user, {
		fields: [clientProfile.userId],
		references: [user.id]
	}),
	appointments: many(appointment),
}));

export const appointmentRelations = relations(appointment, ({one, many}) => ({
	clientProfile: one(clientProfile, {
		fields: [appointment.clientProfileId],
		references: [clientProfile.id]
	}),
	providerService: one(providerService, {
		fields: [appointment.providerServiceId],
		references: [providerService.id]
	}),
	reviews: many(review),
}));

export const reviewRelations = relations(review, ({one}) => ({
	appointment: one(appointment, {
		fields: [review.appointmentId],
		references: [appointment.id]
	}),
}));

export const providerAvailabilityRelations = relations(providerAvailability, ({one}) => ({
	providerProfile: one(providerProfile, {
		fields: [providerAvailability.providerProfileId],
		references: [providerProfile.id]
	}),
}));