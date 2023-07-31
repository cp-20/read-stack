import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const getUserClipsSchema = z.object({
  id: z.string(),
});

export const getUserClips: NextApiHandler = async (req, res) => {
  const query = getUserClipsSchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: query.error });
  }
  const { id } = query.data;

  const supabaseClient = createPagesServerClient({ req, res });
  const session = await supabaseClient.auth.getSession();

  if (session.data.session === null || session.error !== null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (session.data.session.user.id !== id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const clips = await prisma.clips.findMany({
    where: {
      authorId: id,
    },
  });

  return res.status(200).json({ clips });
};
