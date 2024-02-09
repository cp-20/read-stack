import type { AnimatedListItemProps } from '@/client/Home/_components/Article/AnimatedListItem';
import { AnimatedListItem } from '@/client/Home/_components/Article/AnimatedListItem';
import type { Article } from '@read-stack/openapi';
import { useState, useEffect, Fragment } from 'react';

// FIXME: 入れ替えとかで壊れるかも
// 和集合を順序をなるべく考慮して取る
const mergeArray = <T extends { id: unknown }>(prev: T[], next: T[]) => {
  const prevIds = prev.map((a) => a.id);
  const nextIds = next.map((a) => a.id);

  const result: T[] = [];

  for (let i = 0, j = 0; ; ) {
    if (prev.length <= i) {
      result.push(...next.slice(j));
      break;
    }

    if (next.length <= j) {
      result.push(...prev.slice(i));
      break;
    }

    const prevItem = prev[i];
    const nextItem = next[j];

    if (prevItem.id === nextItem.id) {
      result.push(prevItem);
      i++;
      j++;
      continue;
    }

    if (!nextIds.includes(prevItem.id)) {
      result.push(prevItem);
      i++;
    }

    if (!prevIds.includes(nextItem.id)) {
      result.push(nextItem);
      j++;
    }

    if (nextIds.includes(prevItem.id) && prevIds.includes(nextItem.id)) {
      i++;
      j++;
    }
  }

  return result;
};

interface AnimatedListProps<T> {
  articles: (Article & T)[];
  duration: number;
  itemProps?: Omit<AnimatedListItemProps<T>, 'article' | 'isRemoved'>;
}

const isSubset = <T,>(a: T[], b: T[]) => a.every((v) => b.includes(v));

export const AnimatedList = <T,>({
  articles,
  duration,
  itemProps,
}: AnimatedListProps<T>) => {
  const [displayedArticles, setDisplayedArticles] =
    useState<(Article & T)[]>(articles);
  const [removingArticleIds, setRemovingArticleIds] = useState<number[]>([]);

  const articleIds = articles.map((a) => a.id);
  const displayedArticleIds = displayedArticles.map((a) => a.id);

  useEffect(() => {
    const displayingArticleIds = articleIds.concat(removingArticleIds);

    if (
      displayedArticles.length === articleIds.length &&
      isSubset(displayedArticleIds, displayingArticleIds)
    )
      return;

    if (!isSubset(articleIds, displayedArticleIds)) {
      setDisplayedArticles(mergeArray(displayedArticles, articles));
    }
    const removeIds = displayedArticleIds.filter(
      (id) => !displayingArticleIds.includes(id),
    );
    if (removeIds.length > 0) {
      setRemovingArticleIds((prev) => prev.concat(removeIds));
    }

    setTimeout(() => {
      setDisplayedArticles((prev) =>
        prev.filter((a) => !removeIds.includes(a.id)),
      );
      setRemovingArticleIds((prev) =>
        prev.filter((id) => !removeIds.includes(id)),
      );
    }, duration);
  }, [
    articleIds,
    articles,
    displayedArticleIds,
    displayedArticles,
    duration,
    removingArticleIds,
  ]);

  return (
    <>
      {displayedArticles.map((a) => (
        <AnimatedListItem<T>
          article={a}
          isRemoved={removingArticleIds.includes(a.id)}
          key={a.id}
          {...itemProps}
        />
      ))}
    </>
  );
};
