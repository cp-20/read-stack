import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const getUserClipsSchema = z.object({
  id: z.string(),
});

export const getUserClips: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = getUserClipsSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { id } = query.data;

    const clips = await prisma.clips.findMany({
      where: {
        authorId: id,
      },
    });

    return res.status(200).json({ clips });
  },
);
