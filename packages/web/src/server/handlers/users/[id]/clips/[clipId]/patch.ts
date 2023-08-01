import { Prisma } from '@prisma/client';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const updateUserClipByIdSchema = z.object({
  clipId: z.number().int(),
  clip: z
    .object({
      status: z.number().int().min(0).max(2),
      progress: z.number().int().min(0).max(100),
      comment: z.string(),
    })
    .partial(),
});

export const updateUserClipById: NextApiHandler =
  requireAuthWithUserMiddleware()(async (req, res) => {
    const query = updateUserClipByIdSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { clipId, clip: clipData } = query.data;

    try {
      const clip = await prisma.clips.update({
        where: {
          id: clipId,
        },
        data: clipData,
      });
      return res.status(200).json({ clip });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2015') {
          res.status(404).json({ message: 'Not Found' });
        }

        // TODO: 他のエラーコードのときのエラーハンドリング
      }
    }
  });
