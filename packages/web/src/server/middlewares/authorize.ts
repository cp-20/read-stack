import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { Middleware } from '@/server/middlewares/type';

export const requireAuthMiddleware: Middleware =
  (handler) => async (req, res) => {
    const supabaseClient = createPagesServerClient({ req, res });
    const session = await supabaseClient.auth.getSession();
    if (session.data.session === null || session.error !== null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return handler(req, res);
  };

export const requireAuthWithUserMiddleware =
  (key = 'id'): Middleware =>
  (handler) =>
  async (req, res) => {
    const supabaseClient = createPagesServerClient({ req, res });
    const session = await supabaseClient.auth.getSession();
    if (session.data.session === null || session.error !== null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = req.query[key];
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Bad Request' });
    }

    if (session.data.session.user.id !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return handler(req, res);
  };
