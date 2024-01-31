CREATE INDEX IF NOT EXISTS "idx_email_on_users" ON "users" ("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "email_on_users" UNIQUE("email");