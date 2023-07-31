import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const postUserClipsSchema = z.object({
  id: z.string(),
  articleId: z.number().int(),
});

export const postUserClips: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = postUserClipsSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { id, articleId } = query.data;

    const clip = await prisma.clips.create({
      data: {
        status: 0,
        progress: 0,
        authorId: id,
        articleId,
      },
    });

    return res.status(200).json({ clip });
  },
);
