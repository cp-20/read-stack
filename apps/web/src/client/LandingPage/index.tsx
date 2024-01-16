import { css } from '@emotion/react';
import { useMantineTheme } from '@mantine/core';
import type { NextPage } from 'next';
import { Raleway as fontRaleway } from 'next/font/google';
import Image from 'next/image';
import { BottomNavigation } from '@/client/LandingPage/_components/BottomNavigation';
import { Description } from '@/shared/components/Description';
import ogImage from '~/public/icon.svg';

const font = fontRaleway({
  weight: ['600'],
  subsets: ['latin'],
  preload: true,
});

export const LandingPage: NextPage = () => {
  const theme = useMantineTheme();
  return (
    <>
      <Description
        description="技術記事の未読消化を全力でサポートするアプリです"
        title="ReadStack - 技術記事の未読消化をサポート"
      />

      <div
        css={css`
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            gap: 32px;

            @media screen and (max-width: ${theme.breakpoints.sm}) {
              flex-direction: column;
            }
          `}
        >
          <div>
            <Image alt="" height={128} src={ogImage} width={128} />
          </div>
          <div>
            <h1
              className={font.className}
              css={css`
                font-size: 3rem;

                @media screen and (max-width: ${theme.breakpoints.sm}) {
                  font-size: 2.4rem;
                  text-align: center;
                }
              `}
            >
              ReadStack
            </h1>
            <p
              css={css`
                font-size: 1.5rem;

                @media screen and (max-width: ${theme.breakpoints.sm}) {
                  font-size: 1.2rem;
                  text-align: center;
                }
              `}
            >
              技術記事の未読消化をサポート
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    </>
  );
};
