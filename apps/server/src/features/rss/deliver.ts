import {
  createInboxItems,
  getRssUrlAndUserIds,
  saveRssContents,
} from '@read-stack/database';
import { excludeFalsy } from '@read-stack/lib';

import { fetchRss, fetchRssContentArticles } from '@/features/rss/fetch';

export const deliverRss = async () => {
  let lastUpdatedAt: Date | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- あえて
  while (true) {
    const rssItems = await getRssUrlAndUserIds({ before: lastUpdatedAt });
    if (rssItems.length === 0) break;

    for (const rssItem of rssItems) {
      const rss = await fetchRss(rssItem.url);

      const date = new Date();

      const rssContents = excludeFalsy(rss.items.map((item) => item.link)).map(
        (link) => ({
          rssUrl: rssItem.url,
          articleUrl: link,
          createdAt: date,
          updatedAt: date,
        }),
      );

      const savedRssContents = await saveRssContents(rssContents);

      const newRssContents = savedRssContents.filter(
        (c) =>
          // 1sレベルで比較する
          Math.floor(c.createdAt.getTime() / 1000) ===
          Math.floor(date.getTime() / 1000),
      );

      const newArticles = await fetchRssContentArticles(
        newRssContents.map((c) => c.articleUrl),
      );

      const inboxItems = rssItem.userIds.split(',').flatMap((userId) =>
        newArticles.map((article) => ({
          userId,
          articleId: article.id,
        })),
      );

      if (inboxItems.length > 0) {
        await createInboxItems(inboxItems);
      }
    }

    lastUpdatedAt = rssItems.at(-1)?.updatedAt;
  }
};
