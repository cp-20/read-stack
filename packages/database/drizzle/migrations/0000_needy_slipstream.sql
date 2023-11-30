CREATE TABLE IF NOT EXISTS "articleRef" (
	"referFrom" integer NOT NULL,
	"referTo" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT articleRef_referFrom_referTo PRIMARY KEY("referFrom","referTo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "article" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"ogImageUrl" text,
	"summary" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "article_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clips" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" integer NOT NULL,
	"progress" integer NOT NULL,
	"comment" text,
	"articleId" integer NOT NULL,
	"userId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "article_and_author" UNIQUE("articleId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"articleId" integer NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" varchar(1024) NOT NULL,
	"displayName" varchar(1024),
	"avatarUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articleRef" ADD CONSTRAINT "articleRef_referFrom_article_id_fk" FOREIGN KEY ("referFrom") REFERENCES "article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articleRef" ADD CONSTRAINT "articleRef_referTo_article_id_fk" FOREIGN KEY ("referTo") REFERENCES "article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clips" ADD CONSTRAINT "clips_articleId_article_id_fk" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clips" ADD CONSTRAINT "clips_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_articleId_article_id_fk" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
