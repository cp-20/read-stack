import { useAutoRedirectIfNotLoggedIn } from '@/features/supabase/auth';
import { css } from '@emotion/react';
import type { NextPage } from 'next';
import { InboxItemList } from './_components/ArticleListModel/InboxItemList';
import { UnreadClipList } from './_components/ArticleListModel/UnreadClipList';
import { ReadClipList } from './_components/ArticleListModel/ReadClipList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArticleSearchBox } from '@/client/Home/_components/ArticleSearchBox';
import { Text, useMantineTheme } from '@mantine/core';
import { Raleway as fontRaleway } from 'next/font/google';
import Image from 'next/image';
import ogImage from '~/public/icon.svg';

const font = fontRaleway({
  weight: ['600'],
  subsets: ['latin'],
  preload: true,
});

export const Home: NextPage = () => {
  useAutoRedirectIfNotLoggedIn('/login');
  const theme = useMantineTheme();

  return (
    <>
      <div
        css={css`
          display: grid;
          width: 100vw;
          height: 100vh;
          grid-template-rows: auto 1fr;
        `}
      >
        <header
          css={css`
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 2rem;
            border-bottom: 1px solid ${theme.colors.gray[2]};
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 0.5rem;
            `}
          >
            <Image alt="" height={32} src={ogImage} width={32} />
            <Text
              className={font.className}
              css={css`
                font-size: 1.2rem;

                @media screen and (max-width: ${theme.breakpoints.sm}) {
                  font-size: 2.4rem;
                  text-align: center;
                }
              `}
            >
              ReadStack
            </Text>
          </div>
          <ArticleSearchBox />
        </header>
        <main
          css={css`
            display: flex;
            width: 100%;
            padding: 0 1rem;
            gap: 1rem;

            & > div {
              min-width: 0;
              flex: 1;
            }
          `}
        >
          <InboxItemList />
          <UnreadClipList />
          <ReadClipList />
        </main>
      </div>
      <ToastContainer />
    </>
  );
};
