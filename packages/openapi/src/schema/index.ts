import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  displayName: z.string().nullable(),
  avatar: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const ArticleSchema = z.object({
  id: z.number().int(),
  url: z.string(),
  title: z.string(),
  body: z.string(),
  ogImageUrl: z.string().nullable(),
  summary: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const ClipSchema = z.object({
  id: z.number().int(),
  status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  progress: z.number().int().min(0).max(100),
  comment: z.string().nullable(),
  articleId: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Clip = z.infer<typeof ClipSchema>;

export const ClipWithArticleSchema = ClipSchema.merge(
  z.object({
    article: ArticleSchema,
  }),
);

export type ClipWithArticle = z.infer<typeof ClipWithArticleSchema>;
