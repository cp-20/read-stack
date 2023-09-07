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

  const article = await prisma.article.findUnique({
    where: {
      url,
    },
  });

  if (article !== null) {
    return res.status(201).json(article);
  }

  // FIX: 同じ記事が同時に投稿されると、重複して記事が作成される可能性がある
  const articleData = await fetchArticle(url);

  const newArticle = await prisma.article.create({
    data: articleData,
  });

  res.status(200).json(newArticle);
};
