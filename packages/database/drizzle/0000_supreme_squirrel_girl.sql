CREATE TABLE IF NOT EXISTS "articleRefs" (
	"refer_from" integer NOT NULL,
	"refer_to" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT articleRefs_refer_from_refer_to_pk PRIMARY KEY("refer_from","refer_to")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "article_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	CONSTRAINT "article_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "article_tags_on_articles" (
	"article_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT article_tags_on_articles_article_id_tag_id_pk PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"og_image_url" text,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "articles_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clips" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" integer NOT NULL,
	"progress" integer NOT NULL,
	"comment" text,
	"article_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "article_and_user_in_clip" UNIQUE("article_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inboxes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"article_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "article_and_user_in_inbox" UNIQUE("article_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" varchar(1024) NOT NULL,
	"display_name" varchar(1024),
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articleRefs" ADD CONSTRAINT "articleRefs_refer_from_articles_id_fk" FOREIGN KEY ("refer_from") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articleRefs" ADD CONSTRAINT "articleRefs_refer_to_articles_id_fk" FOREIGN KEY ("refer_to") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_tags_on_articles" ADD CONSTRAINT "article_tags_on_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_tags_on_articles" ADD CONSTRAINT "article_tags_on_articles_tag_id_article_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "article_tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clips" ADD CONSTRAINT "clips_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clips" ADD CONSTRAINT "clips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inboxes" ADD CONSTRAINT "inboxes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inboxes" ADD CONSTRAINT "inboxes_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
