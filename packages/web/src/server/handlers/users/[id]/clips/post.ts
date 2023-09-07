import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const postUserClipsSchema = z.object({
  id: z.string(),
});

const postUserClipsBodySchema = z.object({
  articleId: z.number().int(),
});

export const postUserClips: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = postUserClipsSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }

    const body = postUserClipsBodySchema.safeParse(JSON.parse(req.body));
    if (!body.success) {
      return res.status(400).json({ error: body.error });
    }

    const { id: authorId } = query.data;
    const { articleId } = body.data;

    const clip = await prisma.clips.findUnique({
      where: {
        articleId_authorId: {
          articleId,
          authorId,
        },
      },
    });

    if (clip !== null) {
      return res.status(201).json(clip);
    }

    const newClip = await prisma.clips.create({
      data: {
        status: 0,
        progress: 0,
        authorId,
        articleId,
      },
    });

    return res.status(200).json(newClip);
  },
);
