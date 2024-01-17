import { AnimatedList } from '@/client/Home/_components/Article/AnimatedList';
import type {
  AdditionalProps,
  MutatorKey,
} from '@/client/Home/_components/ArticleListModel/useMutators';
import { useSetMutator } from '@/client/Home/_components/ArticleListModel/useMutators';
import { Loader } from '@/client/_components/Loader';
import { css } from '@emotion/react';
import { Center, ScrollArea, Space } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import type { Article } from '@read-stack/openapi';
import { useRef, type ReactNode, useEffect, useCallback } from 'react';
import type { KeyedMutator } from 'swr';
import useSWRInfinite from 'swr/infinite';

export type FetchArticleResult<T> = {
  articles: Article[];
  finished: boolean;
} & T;

export interface ArticleListProps<T extends MutatorKey> {
  stateKey: T;
  keyConstructor: (
    size: number,
    prev?: FetchArticleResult<AdditionalProps[T]>,
  ) => string | null;
  fetcher: (url: string) => Promise<FetchArticleResult<AdditionalProps[T]>>;
  renderActions?: (
    article: Article,
    results: FetchArticleResult<AdditionalProps[T]>[],
  ) => ReactNode;
  noContentComponent: ReactNode;
}

const useLoaderIntersection = (loadNext: () => void, isLoading: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: loaderRef, entry } = useIntersection<HTMLDivElement>({
    root: containerRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- nullになりうる
    if (entry?.isIntersecting && !isLoading) {
      loadNext();
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- nullになりうる
  }, [entry?.isIntersecting, isLoading, loadNext]);

  return { containerRef, loaderRef };
};

export const ArticleList = <T extends MutatorKey>({
  stateKey,
  keyConstructor,
  fetcher,
  renderActions,
  noContentComponent,
}: ArticleListProps<T>): ReactNode => {
  const { setMutator, removeMutator } = useSetMutator();
  const { data, setSize, isLoading, mutate } = useSWRInfinite(
    keyConstructor,
    fetcher,
  );
  const loadNext = useCallback(() => {
    void setSize((size) => size + 1);
  }, [setSize]);
  const { containerRef, loaderRef } = useLoaderIntersection(
    loadNext,
    isLoading,
  );

  const articles = data ? data.flatMap((r) => r.articles) : [];
  const isFinished = data ? data.at(-1)?.finished : false;

  useEffect(() => {
    type MutatorType = KeyedMutator<FetchArticleResult<AdditionalProps[T]>[]>;
    const mutateWrapper: MutatorType = async (mutateData, opts) => {
      await setSize(1);
      const result = await mutate(mutateData, opts);
      return result;
    };
    setMutator(stateKey, mutateWrapper);

    return () => {
      removeMutator(stateKey);
    };
  }, [mutate, removeMutator, setMutator, setSize, stateKey]);

  return (
    <ScrollArea
      css={css`
        display: flex;
        min-height: 0;
        max-height: 100%;
        flex: 1;
        flex-direction: column;
        gap: 1rem;
      `}
      ref={containerRef}
    >
      {(articles.length === 0 && noContentComponent) ?? null}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        `}
      >
        <AnimatedList
          articles={articles}
          duration={2000}
          itemProps={{
            renderActions: (a) => {
              if (!data) return;
              return renderActions?.(a, data);
            },
          }}
        />
      </div>

      {!isFinished && (
        <Center ref={loaderRef}>
          <Loader
            css={css`
              margin-top: 1rem;
            `}
          />
        </Center>
      )}

      <Space h="50vh" />
    </ScrollArea>
  );
};
