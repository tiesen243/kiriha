CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused');--> statement-breakpoint
CREATE TYPE "public"."class_section_status" AS ENUM('waiting', 'locked', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'teacher', 'student');--> statement-breakpoint
CREATE TABLE "account" (
	"provider" varchar(255) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"password" varchar(255),
	CONSTRAINT "account_provider_account_id_pk" PRIMARY KEY("provider","account_id")
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"class_id" varchar(24) NOT NULL,
	"student_id" varchar(10) NOT NULL,
	"status" "attendance_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "class_section" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"subject_id" varchar(24) NOT NULL,
	"teacher_id" varchar(24) NOT NULL,
	"room_id" varchar(24) NOT NULL,
	"status" "class_section_status" DEFAULT 'waiting' NOT NULL,
	"date" date NOT NULL,
	"start_time" time with time zone NOT NULL,
	"end_time" time with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollment" (
	"student_id" varchar(10) NOT NULL,
	"class_id" varchar(24) NOT NULL,
	CONSTRAINT "enrollment_student_id_class_id_pk" PRIMARY KEY("student_id","class_id")
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"capacity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(7) NOT NULL,
	"credit" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subject_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "teacher" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"hired_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"card_id" varchar(32),
	"role" "role" DEFAULT 'student',
	"name" varchar(255) NOT NULL,
	"email" varchar(320),
	"image" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_cardId_unique" UNIQUE("card_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_id_class_section_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_section" ADD CONSTRAINT "class_section_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_section" ADD CONSTRAINT "class_section_teacher_id_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_section" ADD CONSTRAINT "class_section_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_class_id_class_section_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attendance_classId_idx" ON "attendance" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "attendance_studentId_idx" ON "attendance" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_classId_studentId_uq_idx" ON "attendance" USING btree ("class_id","student_id");--> statement-breakpoint
CREATE INDEX "class_section_subjectId_idx" ON "class_section" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "class_section_teacherId_idx" ON "class_section" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "class_section_roomId_idx" ON "class_section" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "student_userId_idx" ON "student" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "teacher_userId_idx" ON "teacher" USING btree ("user_id");