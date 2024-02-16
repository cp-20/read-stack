import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import type { UnreadClipAdditionalProps } from '@/client/Home/_components/ArticleListModel/UnreadClipList';
// eslint-disable-next-line import/no-cycle -- しゃーなし
import {
  unreadClipsFetcher,
  unreadClipsKeyConstructor,
} from '@/client/Home/_components/ArticleListModel/UnreadClipList';
import { useMutators } from '@/client/Home/_components/ArticleListModel/useMutators';
import { css } from '@emotion/react';
import { useMantineTheme, TextInput, Button, Text } from '@mantine/core';
import { postClipResponseSchema } from '@read-stack/openapi';
import type { FC, FormEventHandler } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const AddNewClipForm: FC = () => {
  const theme = useMantineTheme();
  const mutators = useMutators();
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (value === '') return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/users/me/clips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'url',
          articleUrl: value,
        }),
      });
      if (!res.ok) throw new Error('Failed to add new clip');

      const json = await res.json();
      const { clip } = postClipResponseSchema.parse(json);

      setValue('');

      void mutators.unreadClip?.(
        async () => {
          const result = await unreadClipsFetcher(unreadClipsKeyConstructor(1));
          return [result];
        },
        {
          optimisticData: (prev) => {
            if (prev === undefined) return [];

            const newResult: FetchArticleResult<UnreadClipAdditionalProps> = {
              articles: [{ ...clip.article, clip }],
              finished: false,
            };

            return [newResult, ...prev];
          },
        },
      );
    } catch (err) {
      console.error(err);
      return toast('新しい記事の追加に失敗しました', {
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      css={css`
        padding: 1rem;
        border: 1px solid ${theme.colors.gray[2]};
        border-radius: ${theme.radius.md};
        margin-bottom: 1rem;
      `}
      onSubmit={handleSubmit}
    >
      <Text
        css={css`
          margin-bottom: 0.5rem;
        `}
      >
        URLを入力して記事を追加
      </Text>
      <div
        css={css`
          display: grid;
          gap: 0.5rem;
          grid-template-columns: 1fr auto;
        `}
      >
        <TextInput
          disabled={isSubmitting}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="https://example.com/article/1"
          value={value}
        />
        <Button loading={isSubmitting} type="submit">
          追加
        </Button>
      </div>
    </form>
  );
};
