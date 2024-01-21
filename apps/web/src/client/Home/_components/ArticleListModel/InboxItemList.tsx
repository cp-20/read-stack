import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { ArticleList } from '@/client/Home/_components/Article/ArticleList';
import { ArticleListLayout, keyConstructorGenerator } from './common';
import { fetcher } from '@/features/swr/fetcher';
import { Stack, Button, Text } from '@mantine/core';
import type { InboxItemWithArticle } from '@read-stack/openapi';
import {
  getInboxItemsResponseSchema,
  moveInboxItemToClipResponseSchema,
} from '@read-stack/openapi';
import { useCallback, type FC } from 'react';
import NoInboxItemsImage from '~/public/assets/no-inbox-items.png';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { IconChevronRight } from '@tabler/icons-react';
import { useMutators } from './useMutators';
import type { UnreadClipAdditionalProps } from './UnreadClipList';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import {
  unreadClipsFetcher,
  unreadClipsKeyConstructor,
} from './UnreadClipList';

export interface InboxItemAdditionalProps {
  items: InboxItemWithArticle[];
}

export const inboxFetcher = async (url: string) => {
  const res = await fetcher(url);
  const body = getInboxItemsResponseSchema.parse(res);
  const result: FetchArticleResult<InboxItemAdditionalProps> = {
    articles: body.items.map((item) => item.article),
    finished: body.finished,
    items: body.items,
  };
  return result;
};

export const inboxKeyConstructor =
  keyConstructorGenerator<InboxItemAdditionalProps>(
    '/api/v1/users/me/inboxes?limit=10',
  );

const NoContentComponent = (
  <Stack align="center" spacing={8}>
    <Image alt="" src={NoInboxItemsImage} width={256} />
    <Text>受信箱の中に記事はまだありません</Text>
  </Stack>
);

interface ActionSectionProps {
  item: InboxItemWithArticle;
}

const ActionSection: FC<ActionSectionProps> = ({ item }) => {
  const mutators = useMutators();

  const moveToClip = useCallback(async () => {
    try {
      const mutating = fetch(
        `/api/v1/users/me/inboxes/${item.id}/move-to-clip`,
        { method: 'POST' },
      )
        .then((res) => res.json())
        .then((json) => moveInboxItemToClipResponseSchema.parse(json).clip);

      void mutators.inboxItem?.(
        async () => {
          await mutating;
          const result = await inboxFetcher(inboxKeyConstructor(1));

          return [result];
        },
        {
          optimisticData: (prev) => {
            if (prev === undefined) return [];

            const result = prev.map((r) => ({
              ...r,
              articles: r.articles.filter((a) => a.id !== item.articleId),
              items: r.items.filter((i) => i.id !== item.id),
            }));

            return result;
          },
        },
      );

      const clip = await mutating;
      void mutators.unreadClip?.(
        async () => {
          await mutating;
          const result = await unreadClipsFetcher(unreadClipsKeyConstructor(1));
          return [result];
        },
        {
          optimisticData: (prev) => {
            if (prev === undefined) return [];

            const newResult: FetchArticleResult<UnreadClipAdditionalProps> = {
              articles: [item.article],
              clips: [{ ...clip, article: item.article }],
              finished: false,
            };

            return [newResult, ...prev];
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast('記事の移動に失敗しました', { type: 'error' });
    }
  }, [item.article, item.articleId, item.id, mutators]);
  return (
    <Button
      fullWidth
      onClick={moveToClip}
      rightIcon={<IconChevronRight />}
      type="button"
      variant="light"
    >
      スタックに積む
    </Button>
  );
};

export const InboxItemList: FC = () => {
  return (
    <ArticleListLayout label="受信箱">
      <ArticleList
        fetcher={inboxFetcher}
        keyConstructor={inboxKeyConstructor}
        noContentComponent={NoContentComponent}
        renderActions={(article, results) => {
          const item = results
            .flatMap((r) => r.items)
            .find((i) => i.articleId === article.id);
          if (item === undefined) return null;

          return <ActionSection item={item} />;
        }}
        stateKey="inboxItem"
      />
    </ArticleListLayout>
  );
};
