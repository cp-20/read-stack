import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  displayName: z.string().optional(),
  avatarUrl: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const ClipSchema = z.object({
  id: z.number().int(),
  status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  progress: z.number().int().min(0).max(100),
  comment: z.string().optional(),
  articleId: z.number().int(),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Clip = z.infer<typeof ClipSchema>;

export const ArticleSchema = z.object({
  id: z.number().int(),
  url: z.string().url(),
  title: z.string(),
  body: z.string(),
  ogImageUrl: z.string().url().optional(),
  summary: z.string().optional(),
  createdAt: z.date(),
});

export type Article = z.infer<typeof ArticleSchema>;
