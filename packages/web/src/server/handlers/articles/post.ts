import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { fetchArticle } from '@/features/articles/fetchArticle';
import { prisma } from '@/features/database/prismaClient';

const postArticleSchema = z.object({
  url: z.string().url(),
});

export const postArticle: NextApiHandler = async (req, res) => {
  const query = postArticleSchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json(query.error);
    return;
  }

  const { url } = query.data;

  const articleData = await fetchArticle(url);

  const article = await prisma.article.create({
    data: articleData,
  });

  res.status(200).json(article);
};
