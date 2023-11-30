import { excludeFalsy } from '@read-stack/lib';
import { and, eq, inArray, lt } from 'drizzle-orm';

import { db } from '@/database/drizzleClient';
import { clips } from '@/models';

export const findClipById = async (id: number) => {
  const clip = await db.query.clips.findFirst({
    where: (fields) => eq(fields.id, id),
    with: {
      article: true,
    },
  });

  return clip;
};

export const findClipByArticleIdAndAuthorId = async (
  articleId: number,
  authorId: string
) => {
  const clip = await db.query.clips.findFirst({
    where: (fields) =>
      and(eq(fields.articleId, articleId), eq(fields.authorId, authorId)),
  });

  return clip;
};

export interface Clip {
  articleId: number;
  authorId: string;
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

  if (newClip.length === 0) return null;

  return newClip[0];
};

export const saveClip = async (
  articleId: number,
  authorId: string,
  getClip: () => Clip | Promise<Clip>
) => {
  const clip = await findClipByArticleIdAndAuthorId(articleId, authorId);

  if (clip !== undefined) {
    return { exist: true, clip };
  }

  const newClipData = await getClip();

  const newClip = await createClip(newClipData);

  return { exist: false, clip: newClip };
};

const findCursorTimestamp = async (authorId: string, cursor?: number) => {
  if (cursor === undefined) return undefined;

  const clip = await db.query.clips.findFirst({
    columns: {
      updatedAt: true,
    },
    where: (fields) =>
      and(eq(fields.id, cursor), eq(fields.authorId, authorId)),
  });

  return clip?.updatedAt;
};

export const findClipsByUserIdOrderByUpdatedAt = async (
  authorId: string,
  limit: number,
  unreadOnly = true,
  cursor?: number
) => {
  const cursorTimestamp = await findCursorTimestamp(authorId, cursor);

  const selectedClips = await db.query.clips.findMany({
    where: (fields) => {
      const filters = excludeFalsy([
        unreadOnly && inArray(fields.status, [0, 1]),
        cursorTimestamp !== undefined && lt(fields.updatedAt, cursorTimestamp),
      ]);
      return and(eq(fields.authorId, authorId), ...filters);
    },
    orderBy: (fields, { desc }) => desc(fields.updatedAt),
    limit: Math.min(100, limit) + 1,
    with: {
      article: true,
    },
  });

  const finished = selectedClips.length < Math.min(100, limit) + 1;
  const clipData = selectedClips.slice(0, Math.min(100, limit));

  return { clips: clipData, finished };
};

export interface ClipInfo {
  status: number;
  progress: number;
  comment?: string;
}

export const updateClipByIdAndAuthorId = async (
  id: number,
  authorId: string,
  clip: Partial<ClipInfo>
) => {
  const updatedClip = await db
    .update(clips)
    .set({
      ...clip,
      updatedAt: new Date(),
    })
    .where(and(eq(clips.id, id), eq(clips.authorId, authorId)))
    .returning();

  if (updatedClip.length === 0) return null;

  return updatedClip[0];
};

export const deleteClipByIdAndAuthorId = async (
  id: number,
  authorId: string
) => {
  const deletedClip = await db
    .delete(clips)
    .where(and(eq(clips.id, id), eq(clips.authorId, authorId)))
    .returning();

  if (deletedClip.length === 0) return null;

  return deletedClip[0];
};
