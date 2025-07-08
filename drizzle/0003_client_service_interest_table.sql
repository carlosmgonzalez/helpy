CREATE TABLE "client_service_interest" (
	"client_profile_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "client_service_interest_client_profile_id_service_id_pk" PRIMARY KEY("client_profile_id","service_id")
);
--> statement-breakpoint
ALTER TABLE "client_service_interest" ADD CONSTRAINT "client_service_interest_client_profile_id_client_profile_id_fk" FOREIGN KEY ("client_profile_id") REFERENCES "public"."client_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service_interest" ADD CONSTRAINT "client_service_interest_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;