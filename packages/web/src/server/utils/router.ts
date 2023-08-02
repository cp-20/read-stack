import type { NextApiHandler } from 'next';

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
  | 'CONNECT'
  | 'TRACE';

export type MethodHandlers = Partial<{
  [key in Method]: NextApiHandler;
}>;

export const methodRouter =
  (handlers: MethodHandlers): NextApiHandler =>
  (req, res) => {
    if (req.method === undefined) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const handler = handlers[req.method as Method];

    if (handler === undefined) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    return handler(req, res);
  };
