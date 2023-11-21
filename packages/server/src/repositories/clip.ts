import { db, clips } from '@database';

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
