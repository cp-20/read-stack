import { Prisma } from '@prisma/client';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const updateUserClipByIdSchema = z.object({
  id: z.string(),
  clipId: z.number().int(),
  clip: z
    .object({
      status: z.number().int().min(0).max(2),
      progress: z.number().int().min(0).max(100),
      comment: z.string(),
    })
    .partial(),
});

export const updateUserClipById: NextApiHandler = async (req, res) => {
  const query = updateUserClipByIdSchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: query.error });
  }
  const { id, clipId, clip: clipData } = query.data;

  const supabaseClient = createPagesServerClient({ req, res });
  const session = await supabaseClient.auth.getSession();

  if (session.data.session === null || session.error !== null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (session.data.session.user.id !== id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

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
};
