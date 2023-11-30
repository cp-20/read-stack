import { eq } from 'drizzle-orm';

import { db } from '@/database/drizzleClient';
import { users } from '@/models';

export const findUserById = async (id: string) => {
  const results = await db.select().from(users).where(eq(users.id, id));

  if (results.length === 0) return null;

  return results[0];
};

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
}

export const createUser = async (user: UserInfo) => {
  const results = await db
    .insert(users)
    .values({ ...user, createdAt: new Date(), updatedAt: new Date() })
    .returning();

  if (results.length === 0) return null;

  return results[0];
};

export const updateUser = async (user: UserInfo) => {
  const results = await db
    .update(users)
    .set({
      ...user,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .returning();

  if (results.length === 0) return null;

  return results[0];
};

export const findUserAndCreateIfNotExists = async (user: UserInfo) => {
  const foundUser = await findUserById(user.id);

  if (foundUser === null) {
    return createUser(user);
  }

  return foundUser;
};
