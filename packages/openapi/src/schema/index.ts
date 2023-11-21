import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  displayName: z.string().optional(),
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
  ogImageUrl: z.string().optional(),
  summary: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const ClipSchema = z.object({
  id: z.number().int(),
  status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  progress: z.number().int().min(0).max(100),
  comment: z.string().optional(),
  articleId: z.number().int(),
  authorId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Clip = z.infer<typeof ClipSchema>;
