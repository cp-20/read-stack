import { z } from 'zod';

export const ArticleMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  ogImage: z.string(),
  head: z.string(),
  href: z.string(),
  tags: z.array(z.string()),
  referTo: z.array(z.string()),
  referredBy: z.array(z.string()),
  createdAt: z.string(),
});

export type ArticleMeta = z.infer<typeof ArticleMetaSchema>;

export const ArticleSchema = ArticleMetaSchema.extend({
  content: z.string(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const UnreadArticleSchema = ArticleMetaSchema.extend({
  progress: z.number().int().min(0).max(100),
});

export type UnreadArticle = z.infer<typeof UnreadArticleSchema>;
