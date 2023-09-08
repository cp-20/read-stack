import { css } from '@emotion/react';
import {
  Card,
  Text,
  Image,
  useMantineTheme,
  Group,
  RingProgress,
} from '@mantine/core';
import type { FC } from 'react';
import type { Article, Clip } from '@/schema/article';

export type ClipWithArticles = Clip & {
  article: Article;
};

export type UnreadClipListItemProps = {
  clip: ClipWithArticles;
};

export const UnreadClipListItem: FC<UnreadClipListItemProps> = ({ clip }) => {
  const theme = useMantineTheme();
  return (
    <Card withBorder>
      <Group position="apart" noWrap>
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
            <Text color="dimmed" size="xs" lineClamp={2}>
              {clip.article.body}
            </Text>
          </div>
        </div>

        <Image
          src={clip.article.ogImageUrl}
          alt=""
          width={200}
          css={css`
            margin: -${theme.spacing.md} -${theme.spacing.md} -${theme.spacing
                .md} 0;
          `}
        />
      </Group>
    </Card>
  );
};
