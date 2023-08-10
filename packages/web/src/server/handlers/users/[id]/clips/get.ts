import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';
import { parseInt } from '@/shared/lib/parseInt';

const getUserClipsSchema = z.object({
  id: z.string(),
  cursor: z.string().optional(),
  limit: z.string().optional(),
});

export const getUserClips: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = getUserClipsSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { id } = query.data;
    const cursor = parseInt(query.data.cursor, -1);
    const limit = parseInt(query.data.limit, 20);

    const cursorOption = cursor !== -1 ? { cursor: { id: cursor } } : undefined;

    const clips = await prisma.clips.findMany({
      where: {
        authorId: id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        article: true,
      },
      ...cursorOption,
      take: Math.min(100, limit),
      skip: cursor !== undefined ? 1 : 0,
    });

    return res.status(200).json({ clips });
  },
);
