import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { ArticleList } from '@/client/Home/_components/Article/ArticleList';
import { ArticleListLayout, keyConstructorGenerator } from './common';
import { fetcher } from '@/features/swr/fetcher';
import { Stack, Button, Text } from '@mantine/core';
import type { Article, Clip } from '@read-stack/openapi';
import {
  getClipsResponseSchema,
  patchClipResponseSchema,
} from '@read-stack/openapi';
import { useCallback, type FC } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import NoReadArticleImage from '~/public/assets/no-read-articles.png';
import { IconChevronLeft } from '@tabler/icons-react';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import {
  unreadClipsFetcher,
  unreadClipsKeyConstructor,
} from './UnreadClipList';
import { useMutators } from './useMutators';

export interface ReadClipAdditionalProps {
  clip: Clip;
}

export const readClipsFetcher = async (url: string) => {
  const res = await fetcher(url);
  const body = getClipsResponseSchema.parse(res);
  const result: FetchArticleResult<ReadClipAdditionalProps> = {
    articles: body.clips.map((clip) => ({ ...clip.article, clip })),
    finished: body.finished,
  };
  return result;
};

export const readClipsKeyConstructor =
  keyConstructorGenerator<ReadClipAdditionalProps>(
    '/api/v1/users/me/clips?limit=10&readStatus=read',
  );

const NoContentComponent = (
  <Stack align="center" spacing={8}>
    <Image alt="" src={NoReadArticleImage} width={256} />
    <Text>読み終わった記事はまだありません</Text>
  </Stack>
);

const useReducers = () => {
  const mutators = useMutators();
  const markAsUnread = useCallback(
    (article: Article & ReadClipAdditionalProps) => {
      try {
        const body = { clip: { status: 0 } };
        const mutating = fetch(`/api/v1/users/me/clips/${article.clip.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
          .then((res) => res.json())
          .then((json) => patchClipResponseSchema.parse(json).clip);

        void mutators.readClip?.(
          async () => {
            await mutating;
            const result = await readClipsFetcher(readClipsKeyConstructor(1));

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
        toast('記事を未読にすることに失敗しました', { type: 'error' });
      }
    },
    [mutators],
  );

  const deleteClip = useCallback(
    (article: Article & ReadClipAdditionalProps) => {
      try {
        void fetch(`/api/v1/users/me/clips/${article.clip.id}`, {
          method: 'DELETE',
        });

        void mutators.readClip?.(
          async () => {
            const result = await readClipsFetcher(readClipsKeyConstructor(1));

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

  return { markAsUnread, deleteClip };
};

export const ReadClipList: FC = () => {
  const { markAsUnread, deleteClip } = useReducers();

  return (
    <ArticleListLayout label="アーカイブ">
      <ArticleList
        fetcher={readClipsFetcher}
        keyConstructor={readClipsKeyConstructor}
        noContentComponent={NoContentComponent}
        onDelete={(article) => {
          deleteClip(article);
        }}
        renderActions={(article) => (
          <Button
            fullWidth
            leftIcon={<IconChevronLeft />}
            onClick={() => {
              markAsUnread(article);
            }}
            variant="light"
          >
            未読にする
          </Button>
        )}
        stateKey="readClip"
      />
    </ArticleListLayout>
  );
};
