import { excludeFalsy } from '@read-stack/lib';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';

import { db } from '@/database/drizzleClient';
import { articles, clips } from '@/models';
import {
  convertSearchQuery,
  type SearchQuery,
} from '@/repositories/utils/searchQuery';

export const findClipById = async (id: number) => {
  const clip = await db.query.clips.findFirst({
    where: (fields) => eq(fields.id, id),
    with: {
      article: true,
    },
  });

  return clip;
};

export const findClipByArticleIdAndUserId = async (
  articleId: number,
  userId: string,
) => {
  const clip = await db.query.clips.findFirst({
    where: (fields) =>
      and(eq(fields.articleId, articleId), eq(fields.userId, userId)),
  });

  return clip;
};

export interface Clip {
  articleId: number;
  userId: string;
  progress: number;
  status: 0 | 1 | 2;
}

export const createClip = async (clip: Clip) => {
  const newClip = await db
    .insert(clips)
    .values({
      ...clip,
      updatedAt: new Date(),
    })
    .returning();

  return newClip[0];
};

export const saveClip = async (
  articleId: number,
  userId: string,
  getClip: () => Clip | Promise<Clip>,
) => {
  const clip = await findClipByArticleIdAndUserId(articleId, userId);

  if (clip !== undefined) {
    return { exist: true, clip };
  }

  const newClipData = await getClip();

  const newClip = await createClip(newClipData);

  return { exist: false, clip: newClip };
};

const converter = convertSearchQuery(clips.updatedAt);

export const findClipsByUserIdAndReadStatus = async (
  userId: string,
  query: SearchQuery,
  readStatus: 'all' | 'read' | 'unread' = 'all',
  text = '',
  url = '',
) => {
  const { params, condition } = converter(query);

  const selectedClips = await db
    .select({
      clip: clips,
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
    .from(clips)
    .where(
      and(
        ...excludeFalsy([
          eq(clips.userId, userId),
          condition,
          readStatus === 'unread' && inArray(clips.status, [0, 1]),
          readStatus === 'read' && eq(clips.status, 2),
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
    .leftJoin(articles, eq(articles.id, clips.articleId));

  return selectedClips;
};

export interface ClipInfo {
  status: number;
  progress: number;
  comment?: string;
}

export const updateClipByIdAndUserId = async (
  id: number,
  userId: string,
  clip: Partial<ClipInfo>,
) => {
  const updatedClip = await db
    .update(clips)
    .set({
      ...clip,
      updatedAt: new Date(),
    })
    .where(and(eq(clips.id, id), eq(clips.userId, userId)))
    .returning();

  if (updatedClip.length === 0) return null;

  return updatedClip[0];
};

export const deleteClipByIdAndUserId = async (id: number, userId: string) => {
  const deletedClip = await db
    .delete(clips)
    .where(and(eq(clips.id, id), eq(clips.userId, userId)))
    .returning();

  if (deletedClip.length === 0) return null;

  return deletedClip[0];
};
