CREATE TABLE "account" (
	"provider" varchar(255) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"password" varchar(255),
	CONSTRAINT "account_provider_account_id_pk" PRIMARY KEY("provider","account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;