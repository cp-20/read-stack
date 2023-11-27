import type { NextApiHandler } from 'next';

export type Middleware = (handler: NextApiHandler) => NextApiHandler;
