import { db, clips } from '@database';
import { excludeFalsy } from '@lib';

export const findClipByArticleIdAndAuthorId = async (
  articleId: number,
  authorId: string,
) => {
  const clip = await db.query.clips.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.articleId, articleId), eq(fields.authorId, authorId)),
  });

  return clip;
};

export type Clip = {
  articleId: number;
  authorId: string;
  progress: number;
  status: 0 | 1 | 2;
};

export const createClip = async (clip: Clip) => {
  const newClip = await db
    .insert(clips)
    .values({
      ...clip,
      updatedAt: new Date(),
    })
    .returning({
      id: clips.id,
      articleId: clips.articleId,
      authorId: clips.authorId,
      progress: clips.progress,
      status: clips.status,
      updatedAt: clips.updatedAt,
      createdAt: clips.createdAt,
    });

  return newClip[0];
};

export const saveClip = async (
  articleId: number,
  authorId: string,
  getClip: () => Clip | Promise<Clip>,
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
    where: (fields, { and, eq }) =>
      and(eq(fields.id, cursor), eq(fields.authorId, authorId)),
  });

  return clip?.updatedAt;
};

export const findClipsByUserIdOrderByUpdatedAt = async (
  authorId: string,
  limit: number,
  unreadOnly = true,
  cursor?: number,
) => {
  const cursorTimestamp = await findCursorTimestamp(authorId, cursor);

  const clips = await db.query.clips.findMany({
    where: (fields, { and, inArray, lt, eq }) => {
      const filters = excludeFalsy([
        unreadOnly && inArray(fields.status, [0, 1]),
        cursorTimestamp !== undefined && lt(fields.updatedAt, cursorTimestamp),
      ]);
      return and(eq(fields.authorId, authorId), ...filters);
    },
    orderBy: (clips, { desc }) => desc(clips.updatedAt),
    // ...cursorOption,
    limit: Math.min(100, limit) + 1,
    with: {
      article: true,
    },
  });

  const hasMore = clips.length === Math.min(100, limit) + 1;

  return { clips, hasMore };
};
