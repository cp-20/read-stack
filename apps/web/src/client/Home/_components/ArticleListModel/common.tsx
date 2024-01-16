import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { toISOString } from '@/shared/lib/toIsoString';
import { css } from '@emotion/react';
import { Flex } from '@mantine/core';
import type { FC, ReactNode } from 'react';

interface KeyConstructor<T> {
  (size: number, prev: FetchArticleResult<T>): string | null;
  (size: number): string;
}

export const keyConstructorGenerator = <T,>(base: string) => {
  const keyConstructor = (_size: number, prev?: FetchArticleResult<T>) => {
    if (!prev) return base;
    if (prev.finished) return null;
    const last = prev.articles.at(-1);
    if (!last) return base;

    return `${base}&before=${encodeURIComponent(toISOString(last.updatedAt))}`;
  };
  return keyConstructor as KeyConstructor<T>;
};

export interface ArticleListLayoutProps {
  label: ReactNode;
  children: ReactNode;
  actionComponent?: ReactNode;
}

export const ArticleListLayout: FC<ArticleListLayoutProps> = ({
  label,
  children,
  actionComponent,
}) => (
  <Flex
    css={css`
      max-height: 100vh;
      padding: 1rem 0;
    `}
    direction="column"
  >
    <h2
      css={css`
        display: flex;
        align-items: end;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        margin-bottom: 1rem;
      `}
    >
      <span>{label}</span>
      <div>{actionComponent}</div>
    </h2>
    <div
      css={css`
        min-height: 0;
        flex: 1;
      `}
    >
      {children}
    </div>
  </Flex>
);
