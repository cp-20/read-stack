import { eq, sql } from 'drizzle-orm';

import { db } from '@/database/drizzleClient';
import { rssItems } from '@/models';
import {
  type SearchQuery,
  convertSearchQuery,
} from '@/repositories/utils/searchQuery';

const convert = convertSearchQuery(rssItems.updatedAt);

export const getRssUrlAndUserIds = async (query: SearchQuery) => {
  const { params, condition } = convert(query);
  const rss = await db
    .select({
      url: rssItems.url,
      userIds: sql<string>`STRING_AGG(${rssItems.userId}::text, ',')`,
      updatedAt: rssItems.updatedAt,
    })
    .from(rssItems)
    .groupBy(rssItems.url)
    .where(condition)
    .limit(params.limit)
    .offset(params.offset)
    .orderBy(params.orderBy);

  return rss;
};

export const getUserRssItems = async (userId: string) => {
  const rssList = await db.query.rssItems.findMany({
    where: () => eq(rssItems.userId, userId),
  });

  return rssList;
};

export const getUserFromRssUrl = async (url: string) => {
  const rssList = await db.query.rssItems.findMany({
    columns: { userId: true },
    where: () => eq(rssItems.url, url),
  });

  if (rssList.length === 0) return null;

  return rssList.map((r) => r.userId);
};

export const createUserRss = async (
  userId: string,
  url: string,
  name?: string | null
) => {
  const rssList = await db
    .insert(rssItems)
    .values({
      userId,
      name,
      url,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
    .execute();

  if (rssList.length === 0) return null;

  return rssList[0];
};
