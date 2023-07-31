import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const getArticleByIdSchema = z.object({
  id: z.number().int(),
});

export const getArticleById: NextApiHandler = async (req, res) => {
  const query = getArticleByIdSchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json(query.error);
    return;
  }

  const { id } = query.data;

  const article = await prisma.article.findUnique({
    where: {
      id,
    },
  });

  if (!article) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json(article);
};
