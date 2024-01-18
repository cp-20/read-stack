import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { ArticleList } from '@/client/Home/_components/Article/ArticleList';
import { ArticleListLayout, keyConstructorGenerator } from './common';
import { fetcher } from '@/features/swr/fetcher';
import { Stack, Button, Text } from '@mantine/core';
import type { ClipWithArticle } from '@read-stack/openapi';
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
  clips: ClipWithArticle[];
}

export const readClipsFetcher = async (url: string) => {
  const res = await fetcher(url);
  const body = getClipsResponseSchema.parse(res);
  const result: FetchArticleResult<ReadClipAdditionalProps> = {
    articles: body.clips.map((clip) => clip.article),
    finished: body.finished,
    clips: body.clips,
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

interface ActionSectionProps {
  clip: ClipWithArticle;
}

const ActionSection: FC<ActionSectionProps> = ({ clip }) => {
  const mutators = useMutators();
  const markAsUnread = useCallback(() => {
    try {
      const body = { clip: { status: 0 } };
      const mutating = fetch(`/api/v1/users/me/clips/${clip.id}`, {
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
              articles: r.articles.filter((a) => a.id !== clip.articleId),
              clips: r.clips.filter((c) => c.id !== clip.id),
            }));

            return result;
          },
          throwOnError: true,
        },
      );

      void mutators.unreadClip?.(
        async () => {
          await mutating;
          const result = await unreadClipsFetcher(unreadClipsKeyConstructor(1));
          return [result];
        },
        {
          optimisticData: (prev) => {
            if (prev === undefined) return [];

            const newResult: FetchArticleResult<ReadClipAdditionalProps> = {
              articles: [clip.article],
              clips: [{ ...clip, status: 2 }],
              finished: false,
            };

            return [newResult, ...prev];
          },
          throwOnError: true,
        },
      );
    } catch (err) {
      console.error(err);
      toast('記事を未読にすることに失敗しました', { type: 'error' });
    }
  }, [clip, mutators]);

  return (
    <Button
      fullWidth
      onClick={markAsUnread}
      rightIcon={<IconChevronLeft />}
      variant="light"
    >
      未読にする
    </Button>
  );
};

export const ReadClipList: FC = () => {
  return (
    <ArticleListLayout label="アーカイブ">
      <ArticleList
        fetcher={readClipsFetcher}
        keyConstructor={readClipsKeyConstructor}
        noContentComponent={NoContentComponent}
        renderActions={(article, results) => {
          const clip = results
            .flatMap((r) => r.clips)
            .find((c) => c.articleId === article.id);
          if (clip === undefined) return null;

          return <ActionSection clip={clip} />;
        }}
        stateKey="readClip"
      />
    </ArticleListLayout>
  );
};
