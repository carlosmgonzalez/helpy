CREATE TYPE "public"."animal_species" AS ENUM('dog', 'cat', 'exotic', 'bird', 'livestock');--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" RENAME COLUMN "providerProfileId" TO "provider_profile_id";--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" DROP CONSTRAINT "veterinary_provider_profile_providerProfileId_provider_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" ADD COLUMN "clinic_name" varchar(255);--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" ADD COLUMN "emergency_services" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" ADD COLUMN "animal_species" "animal_species"[] NOT NULL;--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" ADD COLUMN "specializations" text[];--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" ADD CONSTRAINT "veterinary_provider_profile_provider_profile_id_provider_profile_id_fk" FOREIGN KEY ("provider_profile_id") REFERENCES "public"."provider_profile"("id") ON DELETE cascade ON UPDATE no action;