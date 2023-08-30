import { css } from '@emotion/react';
import { Button, Group, Popover, TextInput } from '@mantine/core';
import type { FormEventHandler } from 'react';
import { useState, type FC, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useAddClip } from '@/client/_components/hooks/useUserClips';
import 'react-toastify/dist/ReactToastify.css';

export const AddClipButton: FC = () => {
  const { addClip } = useAddClip();
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit: FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (url === '') return;

      setSubmitting(true);

      const result = await addClip(url);

      if (!result) {
        return toast('新しい記事の追加に失敗しました', {
          type: 'error',
        });
      }

      toast(
        <>
          新しい記事「
          <span
            css={css`
              font-weight: bold;
            `}
          >
            {result.article.title}
          </span>
          」を追加しました
        </>,
        {
          type: 'success',
        },
      );
      setUrl('');
      setSubmitting(false);
    },
    [addClip, url],
  );

  return (
    <>
      <Popover trapFocus>
        <Popover.Target>
          <Button variant="gradient">記事を追加</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <form onSubmit={handleSubmit}>
            <Group>
              <TextInput
                placeholder="記事のURL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={submitting}
              />
              <Button type="submit" loading={submitting}>
                追加
              </Button>
            </Group>
          </form>
        </Popover.Dropdown>
      </Popover>
      <ToastContainer autoClose={3000} position="top-center" />
    </>
  );
};
