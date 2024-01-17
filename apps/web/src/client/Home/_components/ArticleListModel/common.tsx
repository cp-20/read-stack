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
      display: flex;
      max-height: 100%;
      flex-direction: column;
      padding-top: 1rem;
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
        display: flex;
        min-height: 0;
        flex: 1;
        flex-direction: column;

        & > div {
          min-height: 0;
        }
      `}
    >
      {children}
    </div>
  </Flex>
);
