import { css } from '@emotion/react';
import {
  Card,
  Group,
  Image,
  RingProgress,
  Text,
  useMantineTheme,
} from '@mantine/core';
import type { ClipWithArticle } from '@read-stack/openapi';
import Link from 'next/link';
import type { FC } from 'react';

export interface UnreadClipListItemProps {
  clip: ClipWithArticle;
}

export const UnreadClipListItem: FC<UnreadClipListItemProps> = ({ clip }) => {
  const theme = useMantineTheme();
  return (
    <Card
      component={Link}
      css={css`
        color: inherit;
        text-decoration: none;
        transition: box-shadow 0.2s, transform 0.2s;

        &:hover {
          box-shadow: ${theme.shadows.xs};
          transform: translateY(-2px);
        }
      `}
      href={clip.article.url}
      rel="noopener noreferrer"
      target="_blank"
      withBorder
    >
      <Group noWrap position="apart">
        <div
          css={css`
            display: flex;
            min-width: 0;
            gap: 0.5rem;
          `}
        >
          <RingProgress
            sections={[{ value: clip.progress, color: 'blue' }]}
            size={64}
            thickness={8}
          />
          <div
            css={css`
              min-width: 0;
            `}
          >
            <Text color={theme.colors.dark[8]} fw="600" lineClamp={1}>
              {clip.article.title}
            </Text>
            <Text color="dimmed" lineClamp={2} size="xs">
              {clip.article.body}
            </Text>
          </div>
        </div>

        <Image
          alt=""
          css={css`
            margin: -${theme.spacing.md} -${theme.spacing.md} -${theme.spacing.md} 0;
          `}
          src={clip.article.ogImageUrl}
          width={200}
        />
      </Group>
    </Card>
  );
};
