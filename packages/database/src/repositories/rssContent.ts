import type { InferInsertModel } from 'drizzle-orm';

import { db } from '@/database/drizzleClient';
import { rssContents } from '@/models';

type NewRssContent = InferInsertModel<typeof rssContents>;

export const saveRssContents = async (newRssContents: NewRssContent[]) => {
  const rssContentList = await db
    .insert(rssContents)
    .values(newRssContents)
    .onConflictDoNothing()
    .returning()
    .execute();

  return rssContentList;
};
