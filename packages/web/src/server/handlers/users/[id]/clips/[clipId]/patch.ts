import { Prisma } from '@prisma/client';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const updateUserClipByIdQuerySchema = z.object({
  clipId: z.number().int(),
});

const updateUserClipByIdBodySchema = z.object({
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
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(req));

    const query = updateUserClipByIdQuerySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const body = updateUserClipByIdBodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ error: body.error });
    }
    const { clipId } = query.data;
    const { clip: patchClip } = body.data;

    try {
      const clip = await prisma.clips.update({
        where: {
          id: clipId,
        },
        data: patchClip,
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
