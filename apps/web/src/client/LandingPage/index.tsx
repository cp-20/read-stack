import { css } from '@emotion/react';
import { Button, Flex, Stack, Text, useMantineTheme } from '@mantine/core';
import type { NextPage } from 'next';
import { Raleway as fontRaleway } from 'next/font/google';
import Image from 'next/image';
import { BottomNavigation } from '@/client/LandingPage/_components/BottomNavigation';
import { Description } from '@/shared/components/Description';
import ogImage from '~/public/icon.svg';
import { useUser } from '@/client/_components/hooks/useUser';
import Link from 'next/link';
import { pagesPath } from '@/shared/lib/$path';
import InboxImage from '~/public/assets/no-inbox-items.png';
import StackImage from '~/public/assets/no-reading-articles.png';
import ArchiveImage from '~/public/assets/no-read-articles.png';

const font = fontRaleway({
  weight: ['600'],
  subsets: ['latin'],
  preload: true,
});

export const LandingPage: NextPage = () => {
  useUser();
  const theme = useMantineTheme();

  return (
    <>
      <Description
        description="技術記事の未読消化を全力でサポートするアプリです"
        title="ReadStack - 技術記事の未読消化をサポート"
      />

      <Flex
        align="center"
        css={css`
          min-height: 100vh;
          padding: 64px;

          @media screen and (width <= 640px) {
            padding: 32px;
          }
        `}
        direction="column"
        gap={64}
      >
        <div
          css={css`
            display: flex;
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

        <Flex align="center" direction="column" gap="sm">
          <Text
            align="center"
            css={css`
              word-break: auto-phrase;
            `}
          >
            未読記事がついつい溜めてしまうそこのあなた、ReadStackで快適な未読消化を体験しませんか？
          </Text>
          <Button
            component={Link}
            css={css`
              width: min-content;
            `}
            href={pagesPath.home.$url()}
          >
            今すぐ試してみる！
          </Button>
        </Flex>

        <div
          css={css`
            width: 100%;
          `}
        >
          <h2
            css={css`
              margin-bottom: 32px;
              text-align: center;
            `}
          >
            他のプラットフォーム
          </h2>
          <Flex
            css={css`
              width: 100%;
              justify-content: center;

              @media screen and (max-width: ${theme.breakpoints.sm}) {
                flex-direction: column;
              }
            `}
            gap={16}
          >
            <Button
              component="a"
              css={css`
                display: inline-block;
              `}
              href="https://chromewebstore.google.com/detail/read-stack-extension/danmimjoippddebidlkdehbhegnjcjon?hl=ja"
              rel="noopener noreferrer"
              target="_blank"
              variant="outline"
            >
              Chrome拡張機能
            </Button>
            <Button
              component="a"
              css={css`
                display: inline-block;
              `}
              href="https://play.google.com/store/apps/details?id=dev.cp20.read_stack"
              rel="noopener noreferrer"
              target="_blank"
              variant="outline"
            >
              Androidアプリ
            </Button>
            <Button
              component="a"
              css={css`
                display: inline-block;
              `}
              disabled
              href=""
              rel="noopener noreferrer"
              target="_blank"
              variant="outline"
            >
              iOSアプリ (準備中)
            </Button>
          </Flex>
        </div>

        <div
          css={css`
            max-width: 960px;
          `}
        >
          <h2
            css={css`
              margin-bottom: 32px;
              text-align: center;
            `}
          >
            ReadStackって何？
          </h2>
          <Stack>
            <Text>
              未読記事の消化をサポートするアプリです。未読記事を自動で管理して消化をサポートします。ReadStackは受信箱、スタック、アーカイブの3つの要素を使って記事の管理を行います。
              受信箱にはRSSの購読や特定のアクセスした記事などが自動で溜まっていきます。その中から興味のある記事を探し、スタックに積むことで未読記事を管理します。
            </Text>
            <Text>
              スタックには直接記事を積むこともできて、積んだ記事を消化することでアーカイブに移動します。アーカイブに移動した記事は消化済みとして管理されます。
              スタックに記事が溜まり過ぎたときは興味のない記事を受信箱に戻してみましょう。いつでも戻すことができるので気軽に戻すことができます。
            </Text>
          </Stack>
          <Flex
            css={css`
              @media screen and (width <= 1096px) {
                display: none;
              }
            `}
            mt={32}
            mx="auto"
          >
            <div
              css={css`
                display: grid;
                width: min-content;
                padding: 16px;
                border: 4px dashed ${theme.colors[theme.primaryColor][4]};
                margin-top: 250px;
                place-content: center;
              `}
            >
              <Image alt="" src={InboxImage} width={160} />
            </div>
            <div
              css={css`
                position: relative;
                flex: 1;

                &::before {
                  position: absolute;
                  top: 33%;
                  left: 48%;
                  display: inline-block;
                  width: 6px;
                  height: 150px;
                  background-color: ${theme.colors.gray[4]};
                  content: '';
                  transform: rotate(72deg);
                }

                &::after {
                  position: absolute;
                  top: 42.9%;
                  left: 82%;
                  display: inline-block;
                  width: 20px;
                  height: calc(20px / 2 * tan(60deg));
                  background-color: ${theme.colors.gray[4]};
                  clip-path: polygon(50% 0, 100% 100%, 0 100%);
                  content: '';
                  transform: rotate(72deg);
                }
              `}
            >
              <Text
                color="gray"
                css={css`
                  position: absolute;
                  top: 41%;
                  left: -15%;
                `}
                fw="bold"
              >
                興味ある記事を積む
              </Text>
            </div>
            <div
              css={css`
                display: grid;
                width: min-content;
                padding: 16px;
                border: 4px dashed ${theme.colors[theme.primaryColor][4]};
                margin-bottom: 250px;
                place-content: center;
              `}
            >
              <Image alt="" src={StackImage} width={160} />
            </div>
            <div
              css={css`
                position: relative;
                flex: 1;

                &::before {
                  position: absolute;
                  top: 33%;
                  left: 48%;
                  display: inline-block;
                  width: 6px;
                  height: 150px;
                  background-color: ${theme.colors.gray[4]};
                  content: '';
                  transform: rotate(-72deg);
                }

                &::after {
                  position: absolute;
                  top: 53%;
                  left: 84%;
                  display: inline-block;
                  width: 20px;
                  height: calc(20px / 2 * tan(60deg));
                  background-color: ${theme.colors.gray[4]};
                  clip-path: polygon(50% 0, 100% 100%, 0 100%);
                  content: '';
                  transform: rotate(108deg);
                }
              `}
            >
              <Text
                color="gray"
                css={css`
                  position: absolute;
                  top: 42%;
                  left: 39%;
                  word-break: keep-all;
                `}
                fw="bold"
              >
                未読記事を消化する
              </Text>
            </div>
            <div
              css={css`
                display: grid;
                width: min-content;
                padding: 16px;
                border: 4px dashed ${theme.colors[theme.primaryColor][4]};
                margin-top: 250px;
                place-content: center;
              `}
            >
              <Image alt="" src={ArchiveImage} width={160} />
            </div>
          </Flex>
        </div>
        <Stack
          css={css`
            max-width: 960px;
          `}
        >
          <h2
            css={css`
              margin-bottom: 32px;
              text-align: center;
            `}
          >
            ReadStackの使い方
          </h2>
          <Text>
            Webはホームからほぼすべての操作を行えます。受信箱、スタック、アーカイブの記事を閲覧したり、それぞれの記事の削除や移動を行うことができます。
            さらに設定画面からRSSの購読・解除や検索画面から記事の全文検索を行えます。
          </Text>
          <Text>
            Webは基本的にChrome拡張機能と一緒に使うことを想定しています。
            Webで記事の名前をクリックすると記事の画面に飛びますが、拡張機能を入れていればスタックに入った記事は自動で進捗管理が行われます。
            また、新しい記事を拡張機能のアイコンをクリックする or
            キーボードショートカット (デフォルトでは Ctrl + Shift + S)
            を押すことでスタックに積むことができます。
          </Text>
          <Text>
            また拡張機能の設定画面では記事のインポート、自動で受信箱に積む記事のリスト
            (URLのglobパターン) その他オプションを設定することができます。
          </Text>
          <a
            css={css`
              color: ${theme.colors[theme.primaryColor][6]};
              text-align: center;
              text-decoration: underline;

              &:hover {
                color: ${theme.colors[theme.primaryColor][7]};
              }

              &:active {
                color: ${theme.colors[theme.primaryColor][8]};
              }
            `}
            href="https://cp20.notion.site/ReadStack-3cba0b374d2648328a42d93af71eedf7"
            rel="noopener noreferrer"
            target="_blank"
          >
            ReadStackについてもっと詳しく知りたい方はこちら
          </a>
        </Stack>
        <BottomNavigation />
      </Flex>
    </>
  );
};
