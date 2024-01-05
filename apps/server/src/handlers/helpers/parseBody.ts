import type { Context } from 'hono';
import type { Schema } from 'zod';

export const parseBody = async <T>(c: Context, schema: Schema<T>) => {
  const parsedBody = schema.safeParse(await c.req.json());
  if (!parsedBody.success) {
    return null;
  }

  return parsedBody.data;
};
