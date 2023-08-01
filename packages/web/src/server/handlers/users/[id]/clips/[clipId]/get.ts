import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const getUserClipByIdSchema = z.object({
  id: z.string(),
  clipId: z.number().int(),
});

export const getUserClipById: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = getUserClipByIdSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { id, clipId } = query.data;

    const clip = await prisma.clips.findFirst({
      where: {
        authorId: id,
        id: clipId,
      },
    });

    return res.status(200).json({ clip });
  },
);
