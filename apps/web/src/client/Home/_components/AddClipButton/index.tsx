import { css } from '@emotion/react';
import { Button, Group, Popover, TextInput } from '@mantine/core';
import { useCallback, useState } from 'react';
import type { FormEventHandler, FC } from 'react';
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

      try {
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
              {result.clip.article.title}
            </span>
            」を追加しました
          </>,
          {
            type: 'success',
          },
        );
        setUrl('');
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
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
                disabled={submitting}
                onChange={(e) => {
                  setUrl((e.target as HTMLInputElement).value);
                }}
                placeholder="記事のURL"
                value={url}
              />
              <Button loading={submitting} type="submit">
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
