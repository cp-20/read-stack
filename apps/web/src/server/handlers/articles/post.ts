import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { fetchArticle } from '@/features/articles/fetchArticle';
import { saveArticleByUrl } from '@/server/repository/article';

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

  const { exist, article } = await saveArticleByUrl(url, () =>
    fetchArticle(url),
  );

  const status = exist ? 200 : 201;

  res.status(status).json(article);
};
