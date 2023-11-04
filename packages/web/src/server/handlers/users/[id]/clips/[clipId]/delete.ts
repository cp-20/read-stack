import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { db } from '@/features/database/drizzleClient';
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

    const clip = await db.query.clips.findFirst({
      where: (fields, { eq }) => eq(fields.id, clipId),
    });
    if (clip === undefined) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ clip });
  });
