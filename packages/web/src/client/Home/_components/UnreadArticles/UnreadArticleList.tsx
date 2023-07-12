import { Stack } from '@mantine/core';
import type { FC } from 'react';
import { UnreadArticleListItem } from '@/client/Home/_components/UnreadArticles/UnreadArticleListItem';
import type { UnreadArticle } from '@/schema/article';

export type UnreadArticleListProps = {
  articles: UnreadArticle[];
};

export const UnreadArticleList: FC<UnreadArticleListProps> = ({ articles }) => {
  return (
    <Stack>
      {articles.map((article) => (
        <UnreadArticleListItem key={article.id} article={article} />
      ))}
    </Stack>
  );
};
