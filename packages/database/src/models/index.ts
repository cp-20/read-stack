import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: varchar('id').primaryKey(),
    email: text('email').notNull(),
    name: varchar('name', { length: 1024 }).notNull(),
    displayName: varchar('display_name', { length: 1024 }),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('email_on_users').on(t.email),
    email: index('idx_email_on_users').on(t.email),
  }),
);

export const apiKeys = pgTable(
  'api_keys',
  {
    apiKey: varchar('api_key').primaryKey(),
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('user_id_in_api_keys').on(t.userId),
  }),
);

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const rssItems = pgTable(
  'rss_items',
  {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id),
    name: text('name'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('user_id_and_url_in_rss_items').on(t.userId, t.url),
  }),
);

export const rssContents = pgTable(
  'rss_contents',
  {
    id: serial('id').primaryKey(),
    rssUrl: text('rss_url').notNull(),
    articleUrl: text('article_url').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('article_and_rss_url_in_rss_contents').on(
      t.rssUrl,
      t.articleUrl,
    ),
  }),
);

export const clips = pgTable(
  'clips',
  {
    id: serial('id').primaryKey(),
    status: integer('status').notNull(),
    progress: integer('progress').notNull(),
    comment: text('comment'),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id),
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('article_and_user_in_clip').on(t.articleId, t.userId),
  }),
);

export const clipRelations = relations(clips, ({ one }) => ({
  article: one(articles, {
    fields: [clips.articleId],
    references: [articles.id],
  }),
}));

export const inboxes = pgTable(
  'inboxes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('article_and_user_in_inbox').on(t.articleId, t.userId),
  }),
);

export const inboxRelations = relations(inboxes, ({ one }) => ({
  article: one(articles, {
    fields: [inboxes.articleId],
    references: [articles.id],
  }),
}));

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  url: text('url').notNull().unique(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  ogImageUrl: text('og_image_url'),
  summary: text('summary'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
});

export const articlesRelations = relations(articles, ({ many }) => ({
  clips: many(clips),
  tags: many(articleTagsOnArticles),
}));

export const articleRefs = pgTable(
  'article_refs',
  {
    referFrom: integer('refer_from')
      .notNull()
      .references(() => articles.id),
    referTo: integer('refer_to')
      .notNull()
      .references(() => articles.id),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.referFrom, t.referTo] }),
  }),
);

export const articleTags = pgTable('article_tags', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
});

export const articleTagsRelations = relations(articleTags, ({ many }) => ({
  articles: many(articleTagsOnArticles),
}));

export const articleTagsOnArticles = pgTable(
  'article_tags_on_articles',
  {
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id),
    tagId: integer('tag_id')
      .notNull()
      .references(() => articleTags.id),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.articleId, t.tagId] }),
  }),
);

export const articleTagsOnArticlesRelations = relations(
  articleTagsOnArticles,
  ({ one }) => ({
    article: one(articles, {
      fields: [articleTagsOnArticles.articleId],
      references: [articles.id],
    }),
    tag: one(articleTags, {
      fields: [articleTagsOnArticles.tagId],
      references: [articleTags.id],
    }),
  }),
);
