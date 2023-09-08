import { css } from '@emotion/react';
import {
  Card,
  Image,
  Progress,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import type { FC } from 'react';

import type { ClipWithArticles } from './UnreadClipListItem';

export type UnreadClipPanelProps = {
  clip: ClipWithArticles;
};

export const UnreadClipPanel: FC<UnreadClipPanelProps> = ({ clip }) => {
  const theme = useMantineTheme();
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      href={clip.article.url}
      target="_blank"
      rel="noopener noreferrer"
      css={css`
        display: flex;
        flex-direction: column;
        color: inherit;
        text-decoration: none;
      `}
    >
      <Card.Section mb="md">
        <Image src={clip.article.ogImageUrl} alt="" width="100%" />
      </Card.Section>

      <Stack
        css={css`
          flex: 1;
        `}
      >
        <Text fw="bold" color={theme.colors.dark[8]}>
          {clip.article.title}
        </Text>
        <Text color="dimmed" size="xs" lineClamp={3}>
          {clip.article.body}
        </Text>

        <Progress
          value={clip.progress}
          css={css`
            margin-top: auto;
          `}
        />
      </Stack>
    </Card>
  );
};
