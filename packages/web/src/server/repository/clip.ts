import { prisma } from '@/features/database/prismaClient';

export const findClipByArticleIdAndAuthorId = async (
  articleId: number,
  authorId: string,
) => {
  const clip = await prisma.clips.findUnique({
    where: {
      articleId_authorId: {
        articleId,
        authorId,
      },
    },
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
  const newClip = await prisma.clips.create({
    data: clip,
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
