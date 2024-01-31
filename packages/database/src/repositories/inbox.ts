import { and, desc, eq, or, sql } from 'drizzle-orm';
import { excludeFalsy } from '@read-stack/lib';

import { db } from '@/database/drizzleClient';
import { articles, inboxes } from '@/models';
import {
  type SearchQuery,
  convertSearchQuery,
} from '@/repositories/utils/searchQuery';

interface InboxItem {
  userId: string;
  articleId: number;
}

export const createInboxItem = async (inboxItem: InboxItem) => {
  const inboxList = await db
    .insert(inboxes)
    .values({
      ...inboxItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
    .execute();

  return inboxList.at(0);
};

export const createInboxItems = async (inboxItems: InboxItem[]) => {
  const inboxList = await db
    .insert(inboxes)
    .values(
      inboxItems.map((inboxItem) => ({
        ...inboxItem,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )
    .returning()
    .execute();

  return inboxList;
};

export const saveInboxItems = async (inboxItems: InboxItem[]) => {
  const inboxList = await db
    .insert(inboxes)
    .values(
      inboxItems.map((inboxItem) => ({
        ...inboxItem,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )
    .onConflictDoNothing()
    .returning()
    .execute();

  return inboxList;
};

const converter = convertSearchQuery(inboxes.createdAt, 20);

export const findInboxItemsByUserId = async (
  userId: string,
  query: SearchQuery,
  text = '',
  url = '',
) => {
  const { condition, params } = converter(query);
  const items = await db
    .select({
      item: inboxes,
      article: {
        id: articles.id,
        title: articles.title,
        body: sql`left(${articles.body}, 200)`,
        ogImageUrl: articles.ogImageUrl,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        summary: articles.summary,
        url: articles.url,
      },
    })
    .from(inboxes)
    .where(
      and(
        ...excludeFalsy([
          eq(inboxes.userId, userId),
          condition,
          text !== '' &&
            or(
              sql`${articles.body} &@~ ${text}`,
              sql`${articles.title} &@~ ${text}`,
            ),
          url !== '' && eq(articles.url, url),
        ]),
      ),
    )
    .orderBy(desc(params.orderBy))
    .limit(params.limit)
    .offset(params.offset)
    .leftJoin(articles, eq(articles.id, inboxes.articleId))
    .execute();

  return items;
};

export const findInboxItemById = async (id: number) => {
  const item = await db.query.inboxes.findFirst({
    where: eq(inboxes.id, id),
  });

  return item;
};

export const saveInboxItem = async (inboxItem: InboxItem) => {
  const item = await db
    .insert(inboxes)
    .values({
      ...inboxItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing()
    .returning()
    .execute();

  return item[0];
};

export const deleteInboxItemByIdAndUserId = async (
  id: number,
  userId: string,
) => {
  const item = await db
    .delete(inboxes)
    .where(and(eq(inboxes.id, id), eq(inboxes.userId, userId)))
    .returning()
    .execute();

  return item.at(0);
};
