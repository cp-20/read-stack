import { z } from '@hono/zod-openapi';

const baseSchema = z.object({
  createdAt: z.coerce.date().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.coerce.date().openapi({ example: '2024-01-01T00:00:00.000Z' }),
});

export const UserSchema = z
  .object({
    id: z.string().openapi({ example: '00000000-0000-0000-0000-000000000000' }),
    email: z.string().openapi({ example: 'me@example.com', format: 'email' }),
    name: z.string().openapi({ example: 'john_doe' }).nullable(),
    displayName: z.string().nullable().openapi({ example: 'John Doe' }),
    avatarUrl: z.string().openapi({
      example: 'https://example.com/avatar.png',
      format: 'url',
    }),
  })
  .merge(baseSchema)
  .openapi('User');

export type User = z.infer<typeof UserSchema>;

export const ArticleSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    url: z.string().openapi({
      example: 'https://example.com/article',
      format: 'url',
    }),
    title: z.string().openapi({ example: 'Example Article' }),
    body: z.string().openapi({ example: 'This is an example article.' }),
    ogImageUrl: z.string().nullable().openapi({
      example: 'https://example.com/og-image.png',
      format: 'url',
    }),
    summary: z.string().nullable().openapi({ example: 'This is a summary.' }),
  })
  .merge(baseSchema)
  .openapi('Article');

export type Article = z.infer<typeof ArticleSchema>;

export const ClipSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    status: z
      .union([z.literal(0), z.literal(1), z.literal(2)])
      .openapi({ example: 0 }),
    progress: z.number().int().min(0).max(100).openapi({ example: 50 }),
    comment: z.string().nullable().openapi({ example: 'This is a comment.' }),
    articleId: z.number().int().openapi({ example: 1 }),
    userId: z
      .string()
      .openapi({ example: '00000000-0000-0000-0000-000000000000' }),
  })
  .merge(baseSchema)
  .openapi('Clip');

export type Clip = z.infer<typeof ClipSchema>;

export const ClipWithArticleSchema = ClipSchema.merge(
  z.object({
    article: ArticleSchema,
  }),
).openapi('ClipWithArticle');

export type ClipWithArticle = z.infer<typeof ClipWithArticleSchema>;

export const RssItemSchema = z
  .object({
    url: z.string().url().openapi({ example: 'https://example.com/rss' }),
    userId: z
      .string()
      .openapi({ example: '00000000-0000-0000-0000-000000000000' }),
    name: z.string().nullable().openapi({ example: 'My RSS Feed' }),
  })
  .merge(baseSchema)
  .openapi('RssItem');

export type RssItem = z.infer<typeof RssItemSchema>;

export const InboxItemSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    userId: z
      .string()
      .openapi({ example: '00000000-0000-0000-0000-000000000000' }),
    articleId: z.number().int().openapi({ example: 1 }),
  })
  .merge(baseSchema)
  .openapi('InboxItem');

export type InboxItem = z.infer<typeof InboxItemSchema>;

export const InboxItemWithArticleSchema = InboxItemSchema.merge(
  z.object({
    article: ArticleSchema,
  }),
).openapi('InboxItemWithArticle');

export type InboxItemWithArticle = z.infer<typeof InboxItemWithArticleSchema>;
