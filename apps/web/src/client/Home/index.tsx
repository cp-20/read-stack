import { useAutoRedirectIfNotLoggedIn } from '@/features/supabase/auth';
import { css } from '@emotion/react';
import type { NextPage } from 'next';
import { InboxItemList } from './_components/ArticleListModel/InboxItemList';
import { UnreadClipList } from './_components/ArticleListModel/UnreadClipList';
import { ReadClipList } from './_components/ArticleListModel/ReadClipList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Home: NextPage = () => {
  useAutoRedirectIfNotLoggedIn('/login');

  return (
    <>
      <div
        css={css`
          width: 100vw;
          height: 100vh;
          padding: 0 1rem;
        `}
      >
        <div
          css={css`
            display: grid;
            width: 100%;
            gap: 1rem;
            grid-template-columns: repeat(3, 1fr);

            & > div {
              min-width: 0;
            }
          `}
        >
          <InboxItemList />
          <UnreadClipList />
          <ReadClipList />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
