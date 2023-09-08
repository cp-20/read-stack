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
import { Status } from './_components/Status';
import type { UnreadClipViewType } from './_components/UnreadClips';
import { UnreadClips } from './_components/UnreadClips';
import { AddClipButton } from '@/client/Home/_components/AddClipButton';

export const Home: NextPage = () => {
  const theme = useMantineTheme();
  const [includeRead, setIncludeRead] = useState(false);
  const [viewType, setViewType] = useState<UnreadClipViewType>('panel');

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
              icon={IconBook2}
              checked={includeRead}
              onChange={(e) => setIncludeRead(e.currentTarget.checked)}
              aria-label="既に読んだ記事を含めるかどうか"
              title="既に読んだ記事を含めるかどうか"
              indeterminate
              size="lg"
            />
            <SegmentedControl
              value={viewType}
              onChange={(type) => setViewType(type as UnreadClipViewType)}
              data={[
                { label: 'Card', value: 'panel' },
                { label: 'List', value: 'list' },
              ]}
            />
          </Flex>
        </h2>
        <UnreadClips type={viewType} includeRead={includeRead} />
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
