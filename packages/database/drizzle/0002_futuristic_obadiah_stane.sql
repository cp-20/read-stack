CREATE TABLE IF NOT EXISTS "article_refs" (
	"refer_from" integer NOT NULL,
	"refer_to" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT article_refs_refer_from_refer_to_pk PRIMARY KEY("refer_from","refer_to")
);
--> statement-breakpoint
DROP TABLE "articleRefs";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_refs" ADD CONSTRAINT "article_refs_refer_from_articles_id_fk" FOREIGN KEY ("refer_from") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_refs" ADD CONSTRAINT "article_refs_refer_to_articles_id_fk" FOREIGN KEY ("refer_to") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
