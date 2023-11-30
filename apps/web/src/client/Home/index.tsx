import { css } from '@emotion/react';
import {
  Checkbox,
  Flex,
  SegmentedControl,
  useMantineTheme,
} from '@mantine/core';
import { IconBook2 } from '@tabler/icons-react';
import type { NextPage } from 'next';
import { useState } from 'react';
import { AddClipButton } from '@/client/Home/_components/AddClipButton';
import { useAutoRedirectIfNotLoggedIn } from '@/features/supabase/auth';
import type { UnreadClipViewType } from './_components/UnreadClips';
import { UnreadClips } from './_components/UnreadClips';

export const Home: NextPage = () => {
  useAutoRedirectIfNotLoggedIn('/login');

  const theme = useMantineTheme();
  const [includeRead, setIncludeRead] = useState(false);
  const [viewType, setViewType] = useState<UnreadClipViewType>('panel');

  return (
    <div
      css={css`
          padding: 1rem;
        `}
    >
      <h2
        css={css`
            display: flex;
            align-items: end;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            margin-bottom: 1rem;
          `}
      >
        <div>未読の記事一覧</div>
        <Flex align="center" gap={16}>
          <Checkbox
            aria-label="既に読んだ記事を含めるかどうか"
            checked={includeRead}
            icon={IconBook2}
            indeterminate
            onChange={(e) => {
              setIncludeRead(e.currentTarget.checked);
            }}
            size="lg"
            title="既に読んだ記事を含めるかどうか"
          />
          <SegmentedControl
            data={[
              { label: 'Card', value: 'panel' },
              { label: 'List', value: 'list' },
            ]}
            onChange={(type) => {
              setViewType(type as UnreadClipViewType);
            }}
            value={viewType}
          />
        </Flex>
      </h2>
      <UnreadClips includeRead={includeRead} type={viewType} />
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
  );
};
