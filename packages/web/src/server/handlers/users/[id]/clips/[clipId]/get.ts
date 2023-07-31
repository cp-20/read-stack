import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const getUserClipByIdSchema = z.object({
  id: z.string(),
  clipId: z.number().int(),
});

export const getUserClipById: NextApiHandler = async (req, res) => {
  const query = getUserClipByIdSchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: query.error });
  }
  const { id, clipId } = query.data;

  const supabaseClient = createPagesServerClient({ req, res });
  const session = await supabaseClient.auth.getSession();

  if (session.data.session === null || session.error !== null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (session.data.session.user.id !== id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const clip = await prisma.clips.findFirst({
    where: {
      authorId: id,
      id: clipId,
    },
  });

  return res.status(200).json({ clip });
};
