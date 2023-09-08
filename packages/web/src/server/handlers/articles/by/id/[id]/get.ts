import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { findArticleById } from '@/server/repository/article';

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

  const article = await findArticleById(id);

  if (article === null) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(article);
};
