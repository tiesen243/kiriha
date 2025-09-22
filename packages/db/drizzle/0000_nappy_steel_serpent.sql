CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused');--> statement-breakpoint
CREATE TYPE "public"."class_section_status" AS ENUM('waiting', 'locked', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'teacher', 'student');--> statement-breakpoint
CREATE TABLE "accounts" (
	"provider" varchar(255) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"password" varchar(255),
	CONSTRAINT "accounts_provider_account_id_pk" PRIMARY KEY("provider","account_id")
);
--> statement-breakpoint
CREATE TABLE "attendances" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"class_id" varchar(24) NOT NULL,
	"student_id" varchar(10) NOT NULL,
	"status" "attendance_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "class_sections" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"code" varchar(12) NOT NULL,
	"subject_id" varchar(24) NOT NULL,
	"teacher_id" varchar(10) NOT NULL,
	"room_id" varchar(24) NOT NULL,
	"status" "class_section_status" DEFAULT 'waiting' NOT NULL,
	"date" date NOT NULL,
	"start_time" time with time zone NOT NULL,
	"end_time" time with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"student_id" varchar(10) NOT NULL,
	"class_id" varchar(24) NOT NULL,
	CONSTRAINT "enrollments_student_id_class_id_pk" PRIMARY KEY("student_id","class_id")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"capacity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"code" varchar(7) NOT NULL,
	"name" varchar(255) NOT NULL,
	"credit" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"hired_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teachers_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"card_id" varchar(32),
	"role" "role" DEFAULT 'student',
	"name" varchar(255) NOT NULL,
	"email" varchar(320),
	"image" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_cardId_unique" UNIQUE("card_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_class_id_class_sections_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_sections" ADD CONSTRAINT "class_sections_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_sections" ADD CONSTRAINT "class_sections_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_sections" ADD CONSTRAINT "class_sections_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_id_class_sections_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attendance_classId_idx" ON "attendances" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "attendance_studentId_idx" ON "attendances" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_classId_studentId_uq_idx" ON "attendances" USING btree ("class_id","student_id");--> statement-breakpoint
CREATE INDEX "class_section_code_idx" ON "class_sections" USING btree ("code");--> statement-breakpoint
CREATE INDEX "class_section_subjectId_idx" ON "class_sections" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "class_section_teacherId_idx" ON "class_sections" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "class_section_roomId_idx" ON "class_sections" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "student_userId_idx" ON "students" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "teacher_userId_idx" ON "teachers" USING btree ("user_id");