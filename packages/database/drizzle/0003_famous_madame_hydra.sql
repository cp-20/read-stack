CREATE TABLE IF NOT EXISTS "rss" (
	"url" text NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "rss_url_user_id_pk" PRIMARY KEY("url","user_id"),
	CONSTRAINT "rss_url_unique" UNIQUE("url"),
	CONSTRAINT "user_id_and_url_and_in_rss" UNIQUE("url","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rss" ADD CONSTRAINT "rss_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
