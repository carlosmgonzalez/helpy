CREATE TABLE "provider_service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"providerProfileId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"priceFrom" integer DEFAULT 0,
	"priceTo" integer NOT NULL,
	"isAvailable" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "provider_service" ADD CONSTRAINT "provider_service_providerProfileId_provider_profile_id_fk" FOREIGN KEY ("providerProfileId") REFERENCES "public"."provider_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_service" ADD CONSTRAINT "provider_service_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;