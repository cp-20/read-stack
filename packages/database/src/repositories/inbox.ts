import { db } from '@/database/drizzleClient';
import { inboxes } from '@/models';

interface InboxItem {
  userId: string;
  articleId: number;
}

export const createInboxItem = async (inboxItem: InboxItem) => {
  const inboxList = await db
    .insert(inboxes)
    .values({
      ...inboxItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
    .execute();

  return inboxList[0];
};

export const createInboxItems = async (inboxItems: InboxItem[]) => {
  const inboxList = await db
    .insert(inboxes)
    .values(
      inboxItems.map((inboxItem) => ({
        ...inboxItem,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
    .returning()
    .execute();

  return inboxList;
};

export const saveInboxItems = async (inboxItems: InboxItem[]) => {
  const inboxList = await db
    .insert(inboxes)
    .values(
      inboxItems.map((inboxItem) => ({
        ...inboxItem,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
    .onConflictDoNothing()
    .returning()
    .execute();

  return inboxList;
};
