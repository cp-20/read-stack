import { css } from '@emotion/react';
import { useMantineTheme } from '@mantine/core';
import type { NextPage } from 'next';

import { Status } from './_components/Status';
import { UnreadClips } from './_components/UnreadClips';
import { AddClipButton } from '@/client/Home/_components/AddClipButton';

export const Home: NextPage = () => {
  const theme = useMantineTheme();
  return (
    <>
      <div
        css={css`
          padding: 1rem;
        `}
      >
        <h2>ステータス</h2>
        <Status />
        <h2
          css={css`
            border-bottom: 1px solid #ccc;
            margin-bottom: 1rem;
          `}
        >
          未読の記事一覧
        </h2>
        <UnreadClips />
        <div
          css={css`
            position: fixed;
            z-index: 100;
            right: 1rem;
            bottom: 1rem;
            box-shadow: ${theme.shadows.md};
          `}
        >
          <AddClipButton />
        </div>
      </div>
    </>
  );
};
