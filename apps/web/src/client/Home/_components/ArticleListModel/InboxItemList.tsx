import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { ArticleList } from '@/client/Home/_components/Article/ArticleList';
import { ArticleListLayout, keyConstructorGenerator } from './common';
import { fetcher } from '@/features/swr/fetcher';
import { Stack, Button, Text } from '@mantine/core';
import type { Article, InboxItem } from '@read-stack/openapi';
import {
  archiveInboxItemResponseSchema,
  getInboxItemsResponseSchema,
  moveInboxItemToClipResponseSchema,
} from '@read-stack/openapi';
import { useCallback, type FC } from 'react';
import NoInboxItemsImage from '~/public/assets/no-inbox-items.png';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { IconChevronRight } from '@tabler/icons-react';
import { useMutators } from './useMutators';

import type { ReadClipAdditionalProps } from './ReadClipList';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import { readClipsFetcher, readClipsKeyConstructor } from './ReadClipList';
import {
  unreadClipsFetcher,
  unreadClipsKeyConstructor,
} from './UnreadClipList';
import type { UnreadClipAdditionalProps } from './UnreadClipList';

export interface InboxItemAdditionalProps {
  item: InboxItem;
}

export const inboxFetcher = async (url: string) => {
  const res = await fetcher(url);
  const body = getInboxItemsResponseSchema.parse(res);
  const result: FetchArticleResult<InboxItemAdditionalProps> = {
    articles: body.items.map((item) => ({ ...item.article, item })),
    finished: body.finished,
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

const useReducers = () => {
  const mutators = useMutators();

  const moveToClip = useCallback(
    async (article: Article & InboxItemAdditionalProps) => {
      try {
        const mutating = fetch(
          `/api/v1/users/me/inboxes/${article.item.id}/move-to-clip`,
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
                articles: r.articles.filter((a) => a.id !== article.id),
              }));

              return result;
            },
          },
        );

        const clip = await mutating;
        void mutators.unreadClip?.(
          async () => {
            await mutating;
            const result = await unreadClipsFetcher(
              unreadClipsKeyConstructor(1),
            );
            return [result];
          },
          {
            optimisticData: (prev) => {
              if (prev === undefined) return [];

              const newResult: FetchArticleResult<UnreadClipAdditionalProps> = {
                articles: [{ ...article, clip }],
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
    },
    [mutators],
  );

  const archive = useCallback(
    async (article: Article & InboxItemAdditionalProps) => {
      try {
        const mutating = fetch(
          `/api/v1/users/me/inboxes/${article.item.id}/archive`,
          { method: 'POST' },
        )
          .then((res) => res.json())
          .then((json) => archiveInboxItemResponseSchema.parse(json).clip);

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
                articles: r.articles.filter((a) => a.id !== article.id),
              }));

              return result;
            },
          },
        );

        const clip = await mutating;
        console.log('clip', clip);

        void mutators.readClip?.(
          async () => {
            const result = await readClipsFetcher(readClipsKeyConstructor(1));
            return [result];
          },
          {
            optimisticData: (prev) => {
              if (prev === undefined) return [];

              const newResult: FetchArticleResult<ReadClipAdditionalProps> = {
                articles: [{ ...article, clip }],
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
    },
    [mutators],
  );

  const deleteItem = useCallback(
    async (article: Article & InboxItemAdditionalProps) => {
      try {
        await fetch(`/api/v1/users/me/inboxes/${article.item.id}`, {
          method: 'DELETE',
        });

        void mutators.inboxItem?.(
          async () => {
            const result = await inboxFetcher(inboxKeyConstructor(1));

            return [result];
          },
          {
            optimisticData: (prev) => {
              if (prev === undefined) return [];

              const result = prev.map((r) => ({
                ...r,
                articles: r.articles.filter((a) => a.id !== article.id),
              }));

              return result;
            },
          },
        );
      } catch (err) {
        console.error(err);
        toast('記事の削除に失敗しました', { type: 'error' });
      }
    },
    [mutators],
  );

  return { moveToClip, archive, deleteItem };
};

export const InboxItemList: FC = () => {
  const { moveToClip, archive, deleteItem } = useReducers();
  return (
    <ArticleListLayout label="受信箱">
      <ArticleList
        fetcher={inboxFetcher}
        keyConstructor={inboxKeyConstructor}
        noContentComponent={NoContentComponent}
        onArchive={(article) => archive(article)}
        onDelete={(article) => deleteItem(article)}
        renderActions={(article) => (
          <Button
            fullWidth
            onClick={() => moveToClip(article)}
            rightIcon={<IconChevronRight />}
            type="button"
            variant="light"
          >
            スタックに積む
          </Button>
        )}
        stateKey="inboxItem"
      />
    </ArticleListLayout>
  );
};
