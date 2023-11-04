import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { db } from '@/features/database/drizzleClient';
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

    const clip = await db.query.clips.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.authorId, id), eq(fields.id, clipId)),
    });

    return res.status(200).json({ clip });
  },
);
