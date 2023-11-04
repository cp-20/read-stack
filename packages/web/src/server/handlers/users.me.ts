import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { Handler } from 'hono';
import { findUserById } from '@/server/repository/user';

export const getMe: Handler = async (c) => {
  const supabaseClient = createPagesServerClient({ req: c.req, res: c.res });

  const session = await supabaseClient.auth.getSession();

  if (session.data.session === null || session.error !== null) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const user = await findUserById(session.data.session.user.id);

  if (user === null) {
    return c.json({ message: 'Not found' }, 404);
  }

  return c.json(user, 200);
};
