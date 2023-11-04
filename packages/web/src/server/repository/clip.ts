import { db } from '@/features/database/drizzleClient';
import { clips } from '@/features/database/models';

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
  const newClip = await db.insert(clips).values({
    ...clip,
    updatedAt: new Date(),
  });

  return newClip;
};

export const saveClip = async (
  articleId: number,
  authorId: string,
  getClip: () => Clip | Promise<Clip>,
) => {
  const clip = await findClipByArticleIdAndAuthorId(articleId, authorId);

  if (clip !== null) {
    return { exist: true, clip };
  }

  const newClipData = await getClip();

  const newClip = await createClip(newClipData);

  return { new: false, clip: newClip };
};
