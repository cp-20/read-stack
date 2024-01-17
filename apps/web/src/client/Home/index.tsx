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
import { pagesPath } from '@/shared/lib/$path';
import Link from 'next/link';
import { SettingsButton } from '@/client/Home/_components/SettingsPanel/SettingsButton';

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
          <Link
            css={css`
              display: flex;
              align-items: center;
              color: inherit;
              gap: 0.5rem;
              text-decoration: none;
              transition: opacity 0.1s;

              &:hover {
                opacity: 0.6;
              }
            `}
            href={pagesPath.$url()}
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
          </Link>
          <div
            css={css`
          display: flex;
          gap: 0.5rem;
          `}
          >
            <ArticleSearchBox />
            <SettingsButton />
          </div>
        </header>
        <main
          css={css`
            display: flex;
            width: 100%;
            min-height: 0;
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
