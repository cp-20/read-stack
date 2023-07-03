import type { FC } from 'react';
import { UnreadArticleList } from '@/client/Home/_components/UnreadArticles/UnreadArticleList';
import { UnreadArticlePanels } from '@/client/Home/_components/UnreadArticles/UnreadArticlePanels';
import { useArticles } from '@/client/_components/hooks/useArticles';

export const UnreadArticles: FC = () => {
  const { articles } = useArticles({ unreadOnly: true });

  return <UnreadArticleList articles={articles} />;
  return <UnreadArticlePanels articles={articles} />;
};
