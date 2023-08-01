import { Prisma } from '@prisma/client';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const deleteUserClipByIdSchema = z.object({
  clipId: z.number().int(),
});

export const deleteUserClipById: NextApiHandler =
  requireAuthWithUserMiddleware()(async (req, res) => {
    const query = deleteUserClipByIdSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { clipId } = query.data;

    try {
      const clip = await prisma.clips.delete({
        where: {
          id: clipId,
        },
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
