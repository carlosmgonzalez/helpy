CREATE TABLE "provider_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_profile_id" uuid NOT NULL,
	"day" "day_of_week" NOT NULL,
	"from" varchar(5) NOT NULL,
	"to" varchar(5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veterinary_provider_profile" (
	"providerProfileId" uuid PRIMARY KEY NOT NULL,
	"license_number" varchar(100) NOT NULL,
	"university" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "service_profile" RENAME TO "provider_profile";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "service_profile_id" TO "provider_profile_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "price_at_bookin" TO "price_at_booking";--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_service_profile_id_service_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "provider_profile" DROP CONSTRAINT "service_profile_service_id_service_id_fk";
--> statement-breakpoint
ALTER TABLE "provider_profile" DROP CONSTRAINT "providerProfile_userId_fkey";
--> statement-breakpoint
ALTER TABLE "provider_schedule" ADD CONSTRAINT "provider_schedule_provider_profile_id_provider_profile_id_fk" FOREIGN KEY ("provider_profile_id") REFERENCES "public"."provider_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veterinary_provider_profile" ADD CONSTRAINT "veterinary_provider_profile_providerProfileId_provider_profile_id_fk" FOREIGN KEY ("providerProfileId") REFERENCES "public"."provider_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_provider_profile_id_provider_profile_id_fk" FOREIGN KEY ("provider_profile_id") REFERENCES "public"."provider_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_profile" ADD CONSTRAINT "provider_profile_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_profile" ADD CONSTRAINT "providerProfile_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;