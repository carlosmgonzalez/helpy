ALTER TYPE "public"."services_location" RENAME TO "service_modality";--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "service_profile" DROP COLUMN "modality_type";
ALTER TABLE "service_profile" ADD COLUMN "modality_type" "public"."service_modality"[] NOT NULL;