import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { findUserById } from '@/server/repository/user';

export const getMe: NextApiHandler = async (req, res) => {
  const supabaseClient = createPagesServerClient({ req, res });

  const session = await supabaseClient.auth.getSession();

  if (session.data.session === null || session.error !== null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await findUserById(session.data.session.user.id);

  if (user === null) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json(user);
};
