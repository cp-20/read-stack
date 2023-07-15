import { css } from '@emotion/react';
import type { FC } from 'react';
import { UnreadArticlePanel } from '@/client/Home/_components/UnreadArticles/UnreadArticlePanel';
import type { UnreadArticle } from '@/schema/article';

export type UnreadArticlePanelsProps = {
  articles: UnreadArticle[];
};

export const UnreadArticlePanels: FC<UnreadArticlePanelsProps> = ({
  articles,
}) => {
  return (
    <div
      css={css`
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      `}
    >
      {articles.map((article) => (
        <UnreadArticlePanel key={article.id} article={article} />
      ))}
    </div>
  );
};
