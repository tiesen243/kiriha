ALTER TABLE "user" ADD COLUMN "card_id" varchar(32);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_cardId_unique" UNIQUE("card_id");