import { css } from '@emotion/react';
import type { NextPage } from 'next';

import { Status } from './_components/Status';
import { UnreadArticles } from './_components/UnreadClips';

export const Home: NextPage = () => {
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
        <UnreadArticles />
      </div>
    </>
  );
};
