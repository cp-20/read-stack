CREATE TABLE IF NOT EXISTS "rss_contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"rss_url" text NOT NULL,
	"article_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "article_and_rss_url_in_rss_contents" UNIQUE("rss_url","article_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rss_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_id_and_url_in_rss_items" UNIQUE("user_id","url")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rss_contents" ADD CONSTRAINT "rss_contents_article_url_articles_url_fk" FOREIGN KEY ("article_url") REFERENCES "articles"("url") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rss_items" ADD CONSTRAINT "rss_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
