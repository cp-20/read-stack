import { eq } from 'drizzle-orm';
import { db } from '@/features/database/drizzleClient';
import { users } from '@/features/database/models';

export const findUserById = async (id: string) => {
  const user = await db.selectDistinct().from(users).where(eq(users.id, id));

  return user;
};
