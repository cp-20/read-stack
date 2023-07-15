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
import type { UnreadArticle } from '@/schema/article';

export type UnreadArticlePanelProps = {
  article: UnreadArticle;
};

export const UnreadArticlePanel: FC<UnreadArticlePanelProps> = ({
  article,
}) => {
  const theme = useMantineTheme();
  return (
    <Link
      href={article.href}
      css={css`
        color: inherit;
        text-decoration: none;
      `}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section mb="md">
          <Image src={article.ogImage} alt="" width="100%" />
        </Card.Section>

        <Stack>
          <Text fw="bold" color={theme.colors.dark[8]}>
            {article.title}
          </Text>
          <Text color="dimmed" size="xs" lineClamp={3}>
            {article.head}
          </Text>

          <Progress value={article.progress} />
        </Stack>
      </Card>
    </Link>
  );
};
