import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import { ArticleList } from '@/client/Home/_components/Article/ArticleList';
import { ArticleListLayout, keyConstructorGenerator } from './common';
import { fetcher } from '@/features/swr/fetcher';
import { Stack, Button, Text } from '@mantine/core';
import type { ClipWithArticle } from '@read-stack/openapi';
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
  clips: ClipWithArticle[];
}

export const unreadClipsFetcher = async (url: string) => {
  const res = await fetcher(url);
  const body = getClipsResponseSchema.parse(res);
  const result: FetchArticleResult<UnreadClipAdditionalProps> = {
    articles: body.clips.map((clip) => clip.article),
    finished: body.finished,
    clips: body.clips,
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

interface PresentationActionSectionProps {
  moveToInbox?: () => void;
  markAsRead?: () => void;
}

const PresentationActionSection: FC<PresentationActionSectionProps> = ({
  moveToInbox,
  markAsRead,
}) => (
  <div
    css={css`
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, 1fr);
    `}
  >
    <Button
      leftIcon={<IconChevronLeft />}
      onClick={moveToInbox}
      variant="light"
    >
      受信箱に戻す
    </Button>
    <Button
      onClick={markAsRead}
      rightIcon={<IconChevronRight />}
      variant="light"
    >
      既読にする
    </Button>
  </div>
);

interface ActionSectionProps {
  clip: ClipWithArticle;
}

const ActionSection: FC<ActionSectionProps> = ({ clip }) => {
  const mutators = useMutators();
  const moveToInbox = useCallback(async () => {
    try {
      const mutating = fetch(
        `/api/v1/users/me/clips/${clip.id}/move-to-inbox`,
        { method: 'POST' },
      )
        .then((res) => res.json())
        .then((json) => moveUserClipToInboxResponseSchema.parse(json).item);

      void mutators.unreadClip?.(
        async () => {
          await mutating;
          const result = await unreadClipsFetcher(unreadClipsKeyConstructor(1));

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
              articles: [clip.article],
              items: [{ ...item, article: clip.article }],
              finished: false,
            };

            return [newResult, ...prev];
          },
          throwOnError: true,
        },
      );
    } catch (err) {
      console.error(err);
      toast('記事の移動に失敗しました', { type: 'error' });
    }
  }, [clip.article, clip.articleId, clip.id, mutators]);

  const markAsRead = useCallback(() => {
    try {
      const body = { clip: { status: 2 } };
      const mutating = fetch(`/api/v1/users/me/clips/${clip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((json) => patchClipResponseSchema.parse(json).clip);

      void mutators.unreadClip?.(
        async () => {
          await mutating;
          const result = await unreadClipsFetcher(unreadClipsKeyConstructor(1));

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
      toast('記事を既読にすることに失敗しました', { type: 'error' });
    }
  }, [clip, mutators]);

  return (
    <PresentationActionSection
      markAsRead={markAsRead}
      moveToInbox={moveToInbox}
    />
  );
};

export const UnreadClipList: FC = () => {
  return (
    <ArticleListLayout label="スタック">
      <AddNewClipForm />
      <ArticleList
        fetcher={unreadClipsFetcher}
        keyConstructor={unreadClipsKeyConstructor}
        noContentComponent={NoContentComponent}
        renderActions={(article, results) => {
          const clip = results
            .flatMap((r) => r.clips)
            .find((c) => c.articleId === article.id);
          if (clip === undefined) {
            return <PresentationActionSection />;
          }

          return <ActionSection clip={clip} />;
        }}
        stateKey="unreadClip"
      />
    </ArticleListLayout>
  );
};
