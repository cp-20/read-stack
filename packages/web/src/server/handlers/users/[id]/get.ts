import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';

const getUserQuerySchema = z.object({
  id: z.string(),
});

export const getUser: NextApiHandler = async (req, res) => {
  const query = getUserQuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json(query.error);
  }

  const user = await prisma.users.findUnique({
    where: {
      id: query.data.id,
    },
  });

  if (user) {
    return res.status(200).json(user);
  }

  return res.status(404).json({ message: 'user not found' });
};
