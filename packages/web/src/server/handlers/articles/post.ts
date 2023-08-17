import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { fetchArticle } from '@/features/articles/fetchArticle';
import { prisma } from '@/features/database/prismaClient';

const postArticleSchema = z.object({
  url: z.string().url(),
});

export const postArticle: NextApiHandler = async (req, res) => {
  const body = postArticleSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json(body.error);
    return;
  }

  const { url } = body.data;

  const articleData = await fetchArticle(url);

  const article = await prisma.article.create({
    data: articleData,
  });

  res.status(200).json(article);
};
