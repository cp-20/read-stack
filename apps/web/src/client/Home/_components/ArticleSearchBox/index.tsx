import { TextSearchModal } from '@/client/Home/_components/TextSearchModal';
import { css } from '@emotion/react';
import { Code, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import type { FC } from 'react';

export const ArticleSearchBox: FC = () => {
  const theme = useMantineTheme();
  const [opened, handlers] = useDisclosure(true);
  
  return (
    <div>
      <UnstyledButton
        css={css`
          display: flex;
          width: 240px;
          align-items: center;
          padding: 0.5rem 1rem;
          border: 1px solid ${theme.colors.gray[4]};
          border-radius: ${theme.radius.md};
          gap: 8px;
        `}
        onClick={handlers.open}
      >
        <IconSearch
          css={css`
            width: 1rem;
            height: 1rem;
            color: ${theme.colors.gray[5]};
          `}
          stroke={1.5}
        />
        <Text color="dimmed" size="sm">
          記事を検索
        </Text>
        <Code
          css={css`
            border: 1px solid ${theme.colors.gray[2]};
            margin-left: auto;
            background-color: ${theme.colors.gray[0]};
            font-size: 10px;
            font-weight: 700;
          `}
        >
          Ctrl + K
        </Code>
      </UnstyledButton>
      <TextSearchModal onClose={handlers.close} opened={opened} />
    </div>
  );
};
