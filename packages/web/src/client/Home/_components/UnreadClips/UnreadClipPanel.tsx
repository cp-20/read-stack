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
    <Link
      href={clip.article.url}
      css={css`
        color: inherit;
        text-decoration: none;
      `}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section mb="md">
          <Image src={clip.article.ogImageUrl} alt="" width="100%" />
        </Card.Section>

        <Stack>
          <Text fw="bold" color={theme.colors.dark[8]}>
            {clip.article.title}
          </Text>
          <Text color="dimmed" size="xs" lineClamp={3}>
            {clip.article.body}
          </Text>

          <Progress value={clip.progress} />
        </Stack>
      </Card>
    </Link>
  );
};
