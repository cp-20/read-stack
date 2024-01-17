import { css } from '@emotion/react';
import { useMantineTheme, TextInput, Button, Text } from '@mantine/core';
import type { FC, FormEventHandler } from 'react';
import { useState } from 'react';

export const AddNewClipForm: FC = () => {
  const theme = useMantineTheme();
  const [value, setValue] = useState('');
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  return (
    <form
      css={css`
        padding: 1rem;
        border: 1px solid ${theme.colors.gray[2]};
        border-radius: ${theme.radius.md};
        margin-bottom: 1rem;
      `}
      onSubmit={handleSubmit}
    >
      <Text
        css={css`
          margin-bottom: 0.5rem;
        `}
      >
        URLを入力して記事を追加
      </Text>
      <div
        css={css`
          display: grid;
          gap: 0.5rem;
          grid-template-columns: 1fr auto;
        `}
      >
        <TextInput
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="https://example.com/article/1"
          value={value}
        />
        <Button type="submit">追加</Button>
      </div>
    </form>
  );
};
