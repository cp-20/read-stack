import type { ArticleListItemProps } from '@/client/Home/_components/Article/ArticleListItem';
import { ArticleListItem } from '@/client/Home/_components/Article/ArticleListItem';
import { css } from '@emotion/react';
import { memo } from 'react';

export type AnimatedListItemProps<T> = {
  isRemoved: boolean;
} & ArticleListItemProps<T>;

const UnmemorizedAnimatedListItem = <T,>({
  isRemoved,
  ...props
}: AnimatedListItemProps<T>) => {
  return (
    <ArticleListItem
      css={css`
        min-height: 0;
        max-height: ${isRemoved ? '0' : '300px'};
        animation: ${isRemoved
          ? 'disappear 0.2s forwards'
          : 'appear 0.2s forwards'};
        opacity: ${isRemoved ? 0 : 1};
        transform: ${isRemoved ? 'scale(0.9)' : 'none'};
        transition:
          opacity 0.2s,
          transform 0.2s,
          max-height 0.2s 0.2s;

        @keyframes appear {
          0% {
            max-height: 0;
            margin-bottom: -0.5rem;
            opacity: 0;
            transform: scale(0.9);
          }

          50% {
            max-height: 300px;
            margin-bottom: 0;
            opacity: 0;
            transform: scale(0.9);
          }

          100% {
            max-height: 300px;
            margin-bottom: 0;
            opacity: 1;
            transform: none;
          }
        }

        @keyframes disappear {
          0% {
            max-height: 300px;
            margin-bottom: 0;
            opacity: 1;
            transform: none;
          }

          50% {
            max-height: 300px;
            margin-bottom: -0.5rem;
            opacity: 0;
            transform: scale(0.9);
          }

          100% {
            max-height: 0;
            margin-bottom: -0.5rem;
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}
      {...props}
    />
  );
};

export const AnimatedListItem = memo(
  UnmemorizedAnimatedListItem,
  (prev, next) => {
    return [
      prev.isRemoved === next.isRemoved,
      prev.article.id === next.article.id,
    ].every(Boolean);
  },
) as typeof UnmemorizedAnimatedListItem;
