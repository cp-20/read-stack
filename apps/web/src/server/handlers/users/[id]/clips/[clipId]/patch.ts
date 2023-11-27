import { eq } from 'drizzle-orm';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { db } from '@/features/database/drizzleClient';
import { clips } from '@/features/database/models';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';

const updateUserClipByIdQuerySchema = z.object({
  clipId: z.string(),
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
    const query = updateUserClipByIdQuerySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const body = updateUserClipByIdBodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ error: body.error });
    }
    const { clipId: clipIdStr } = query.data;
    const { clip: patchClip } = body.data;

    const clipId = parseInt(clipIdStr, 10);
    if (isNaN(clipId)) {
      return res.status(400).json({ message: 'clipId is not a number' });
    }

    const updatedClips = await db
      .update(clips)
      .set(patchClip)
      .where(eq(clips.id, clipId))
      .returning({
        id: clips.id,
        status: clips.status,
        progress: clips.progress,
        comment: clips.comment,
        createdAt: clips.createdAt,
        updatedAt: clips.updatedAt,
        articleId: clips.articleId,
        authorId: clips.authorId,
      });

    if (updatedClips.length === 0) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ clip: updatedClips[0] });
  });
