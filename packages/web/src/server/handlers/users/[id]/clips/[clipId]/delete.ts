import { Prisma } from '@prisma/client';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const deleteUserClipByIdSchema = z.object({
  id: z.string(),
  clipId: z.number().int(),
});

export const deleteUserClipById: NextApiHandler = async (req, res) => {
  const query = deleteUserClipByIdSchema.safeParse(req.query);
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
};
