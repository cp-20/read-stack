import { eq } from 'drizzle-orm';

import { db } from '@/database/drizzleClient';
import { apiKeys } from '@/models';

export const findUserFromApiKey = async (apiKey: string) => {
  const key = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.apiKey, apiKey),
    with: {
      user: true,
    },
  });

  return key?.user ?? null;
};

export const createApiKey = async (userId: string, apiKey: string) => {
  await db
    .insert(apiKeys)
    .values({
      userId,
      apiKey,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .execute();
};

export const deleteApiKey = async (userId: string) => {
  await db.delete(apiKeys).where(eq(apiKeys.userId, userId)).execute();
};
