import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { findArticleByUrl } from '@/server/repository/article';

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

  const article = await findArticleByUrl(url);

  if (article === null) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(article);
};
