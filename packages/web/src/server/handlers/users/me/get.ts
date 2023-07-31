import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { prisma } from '@/features/database/prismaClient';

export const getMe: NextApiHandler = async (req, res) => {
  const supabaseClient = createPagesServerClient({ req, res });

  const session = await supabaseClient.auth.getSession();

  if (session.data.session === null || session.error !== null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session.data.session?.user.id,
    },
  });

  if (user !== null) {
    return res.status(200).json(user);
  }

  return res.status(404).json({ message: 'Not Found' });
};
