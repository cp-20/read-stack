import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const getArticleByUrlSchema = z.object({
  url: z.string().url(),
});

export const getArticleByUrl: NextApiHandler = async (req, res) => {
  const query = getArticleByUrlSchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json(query.error);
    return;
  }

  const { url } = query.data;

  const article = await prisma.article.findUnique({
    where: {
      url,
    },
  });

  if (!article) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json(article);
};
