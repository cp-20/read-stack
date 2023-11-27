import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { findUserById } from '@/server/repository/user';

const getUserQuerySchema = z.object({
  id: z.string(),
});

export const getUser: NextApiHandler = async (req, res) => {
  const query = getUserQuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json(query.error);
  }

  const { id } = query.data;

  const user = await findUserById(id);

  if (user === null) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(user);
};
