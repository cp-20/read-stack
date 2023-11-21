import { eq, users, db } from '@database';

export const findUserById = async (id: string) => {
  const results = await db.select().from(users).where(eq(users.id, id));

  if (results.length === 0) return null;

  return results[0];
};
