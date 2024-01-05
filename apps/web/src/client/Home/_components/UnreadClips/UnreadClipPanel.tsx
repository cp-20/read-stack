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
import type { ClipWithArticle } from '@read-stack/openapi';

export interface UnreadClipPanelProps {
  clip: ClipWithArticle;
}

export const UnreadClipPanel: FC<UnreadClipPanelProps> = ({ clip }) => {
  const theme = useMantineTheme();
  return (
    <Card
      component={Link}
      css={css`
        display: flex;
        flex-direction: column;
        color: inherit;
        text-decoration: none;
        transition: box-shadow 0.2s, transform 0.2s;

        &:hover {
          box-shadow: ${theme.shadows.md};
          transform: translateY(-2px);
        }
      `}
      href={clip.article.url}
      padding="lg"
      radius="md"
      rel="noopener noreferrer"
      shadow="sm"
      target="_blank"
      withBorder
    >
      <Card.Section mb="md">
        <Image alt="" src={clip.article.ogImageUrl} width="100%" />
      </Card.Section>

      <Stack
        css={css`
          flex: 1;
        `}
      >
        <Text color={theme.colors.dark[8]} fw="bold" lineClamp={2}>
          {clip.article.title}
        </Text>
        <Text color="dimmed" lineClamp={3} size="xs">
          {clip.article.body}
        </Text>

        <Progress
          css={css`
            margin-top: auto;
          `}
          value={clip.progress}
        />
      </Stack>
    </Card>
  );
};
