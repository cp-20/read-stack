import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { ArticleList } from '@/client/Home/_components/Article/ArticleList';
import { ArticleListLayout, keyConstructorGenerator } from './common';
import { fetcher } from '@/features/swr/fetcher';
import { Stack, Button, Text } from '@mantine/core';
import type { Article, Clip } from '@read-stack/openapi';
import {
  getClipsResponseSchema,
  moveUserClipToInboxResponseSchema,
  patchClipResponseSchema,
} from '@read-stack/openapi';
import { useCallback } from 'react';
import type { FC } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import NoReadingArticleImage from '~/public/assets/no-reading-articles.png';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { css } from '@emotion/react';
import { useMutators } from './useMutators';
import type { InboxItemAdditionalProps } from './InboxItemList';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import { inboxFetcher, inboxKeyConstructor } from './InboxItemList';
import type { ReadClipAdditionalProps } from './ReadClipList';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import { readClipsFetcher, readClipsKeyConstructor } from './ReadClipList';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import { AddNewClipForm } from '@/client/Home/_components/Article/AddNewClipForm';

export interface UnreadClipAdditionalProps {
  clip: Clip;
}

export const unreadClipsFetcher = async (url: string) => {
  const res = await fetcher(url);
  const body = getClipsResponseSchema.parse(res);
  const result: FetchArticleResult<UnreadClipAdditionalProps> = {
    articles: body.clips.map((clip) => ({ ...clip.article, clip })),
    finished: body.finished,
  };
  return result;
};

export const unreadClipsKeyConstructor =
  keyConstructorGenerator<UnreadClipAdditionalProps>(
    '/api/v1/users/me/clips?limit=10&readStatus=unread',
  );

const NoContentComponent = (
  <Stack align="center" spacing={8}>
    <Image alt="" src={NoReadingArticleImage} width={256} />
    <Text>スタックに積まれた記事はまだありません</Text>
  </Stack>
);

const useReducers = () => {
  const mutators = useMutators();
  const moveToInbox = useCallback(
    async (article: Article & UnreadClipAdditionalProps) => {
      try {
        const mutating = fetch(
          `/api/v1/users/me/clips/${article.clip.id}/move-to-inbox`,
          { method: 'POST' },
        )
          .then((res) => res.json())
          .then((json) => moveUserClipToInboxResponseSchema.parse(json).item);

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

              const result = prev.map((r) => ({
                ...r,
                articles: r.articles.filter((a) => a.id !== article.id),
              }));

              return result;
            },
          },
        );

        const item = await mutating;
        void mutators.inboxItem?.(
          async () => {
            await mutating;
            const result = await inboxFetcher(inboxKeyConstructor(1));
            return [result];
          },
          {
            optimisticData: (prev) => {
              if (prev === undefined) return [];

              const newResult: FetchArticleResult<InboxItemAdditionalProps> = {
                articles: [{ ...article, item }],
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

  const markAsRead = useCallback(
    (article: Article & UnreadClipAdditionalProps) => {
      try {
        const body = { clip: { status: 2 } };
        const mutating = fetch(`/api/v1/users/me/clips/${article.clip.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
          .then((res) => res.json())
          .then((json) => patchClipResponseSchema.parse(json).clip);

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

              const result = prev.map((r) => ({
                ...r,
                articles: r.articles.filter((a) => a.id !== article.id),
              }));

              return result;
            },
          },
        );

        void mutators.readClip?.(
          async () => {
            await mutating;
            const result = await readClipsFetcher(readClipsKeyConstructor(1));
            return [result];
          },
          {
            optimisticData: (prev) => {
              if (prev === undefined) return [];

              const newResult: FetchArticleResult<ReadClipAdditionalProps> = {
                articles: [
                  { ...article, clip: { ...article.clip, status: 2 } },
                ],
                finished: false,
              };

              return [newResult, ...prev];
            },
          },
        );
      } catch (err) {
        console.error(err);
        toast('記事を既読にすることに失敗しました', { type: 'error' });
      }
    },
    [mutators],
  );

  const deleteClip = useCallback(
    (article: Article & UnreadClipAdditionalProps) => {
      try {
        const mutating = fetch(`/api/v1/users/me/clips/${article.clip.id}`, {
          method: 'DELETE',
        })
          .then((res) => res.json())
          .then((json) => patchClipResponseSchema.parse(json).clip);

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

  return { markAsRead, moveToInbox, deleteClip };
};

export const UnreadClipList: FC = () => {
  const { markAsRead, moveToInbox, deleteClip } = useReducers();

  return (
    <ArticleListLayout label="スタック">
      <AddNewClipForm />
      <ArticleList
        fetcher={unreadClipsFetcher}
        keyConstructor={unreadClipsKeyConstructor}
        noContentComponent={NoContentComponent}
        onDelete={(article) => {
          deleteClip(article);
        }}
        renderActions={(article) => (
          <div
            css={css`
              display: grid;
              gap: 1rem;
              grid-template-columns: repeat(2, 1fr);
            `}
          >
            <Button
              leftIcon={<IconChevronLeft />}
              onClick={() => moveToInbox(article)}
              variant="light"
            >
              受信箱に戻す
            </Button>
            <Button
              onClick={() => {
                markAsRead(article);
              }}
              rightIcon={<IconChevronRight />}
              variant="light"
            >
              既読にする
            </Button>
          </div>
        )}
        stateKey="unreadClip"
      />
    </ArticleListLayout>
  );
};
