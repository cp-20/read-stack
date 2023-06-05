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
import type { UnreadArticle } from '@/schema/article';

export type UnreadArticleListItemProps = {
  article: UnreadArticle;
};

export const UnreadArticleListItem: FC<UnreadArticleListItemProps> = ({
  article,
}) => {
  const theme = useMantineTheme();
  return (
    <Card withBorder>
      <Group position="apart" noWrap>
        <div
          css={css`
            display: flex;
            gap: 0.5rem;
          `}
        >
          <RingProgress
            sections={[{ value: article.progress, color: 'blue' }]}
            size={64}
            thickness={8}
          />
          <div>
            <Text color={theme.colors.dark[8]} fw="600" lineClamp={1}>
              {article.title}
            </Text>
            <Text color="dimmed" size="xs" lineClamp={2}>
              {article.head}
            </Text>
          </div>
        </div>

        <Image
          src={article.ogImage}
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
