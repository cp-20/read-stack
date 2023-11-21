// 全体的にテーブル設計を見直したい
// 特にDB側はスネークケースで統一したい

import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  unique,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  email: text('email').notNull(),
  name: varchar('name', { length: 1024 }).notNull(),
  displayName: varchar('displayName', { length: 1024 }),
  avatarUrl: text('avatarUrl'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

export const clips = pgTable(
  'clips',
  {
    id: serial('id').primaryKey(),
    status: integer('status').notNull(),
    progress: integer('progress').notNull(),
    comment: text('comment'),
    articleId: integer('articleId')
      .notNull()
      .references(() => articles.id),
    // authorIdにしたい
    authorId: varchar('userId')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: unique('article_and_author').on(t.articleId, t.authorId),
  }),
);

export const clipRelations = relations(clips, ({ one }) => ({
  article: one(articles, {
    fields: [clips.articleId],
    references: [articles.id],
  }),
}));

export const articles = pgTable('article', {
  id: serial('id').primaryKey(),
  url: text('url').notNull().unique(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  ogImageUrl: text('ogImageUrl'),
  summary: text('summary'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  // updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

export const articleRefs = pgTable(
  'articleRef',
  {
    referFrom: integer('referFrom')
      .notNull()
      .references(() => articles.id),
    referTo: integer('referTo')
      .notNull()
      .references(() => articles.id),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
  },
  (t) => ({
    unique: primaryKey(t.referFrom, t.referTo),
  }),
);

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
  articleId: integer('articleId')
    .notNull()
    .references(() => articles.id),
});
