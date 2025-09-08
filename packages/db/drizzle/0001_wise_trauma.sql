ALTER TABLE "class_section" ADD COLUMN "code" varchar(12) NOT NULL;--> statement-breakpoint
CREATE INDEX "class_section_code_idx" ON "class_section" USING btree ("code");