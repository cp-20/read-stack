import type { NextApiHandler } from 'next';
export const handler: NextApiHandler = (_req, res) => {
  res.status(200).json([{ name: 'John Doe' }]);
};
