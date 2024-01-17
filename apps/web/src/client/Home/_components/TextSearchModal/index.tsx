import { css } from '@emotion/react';
import { Divider, Modal, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { FC } from 'react';

interface TextSearchModalProps {
  opened: boolean;
  onClose: () => void;
}

export const TextSearchModal: FC<TextSearchModalProps> = ({
  opened,
  onClose,
}) => {
  const searchResult = new Array(20).fill(0).map((_) => 'hello');

  return (
    <Modal onClose={onClose} opened={opened} withCloseButton={false}>
      <TextInput
        data-autofocus
        icon={<IconSearch />}
        placeholder="検索したい内容を入力"
        variant="unstyled"
      />
      <Divider />
      <div
        css={css`
        padding-top: 1rem;
      `}
      >
        {searchResult.length === 0 && <Text>No results found</Text>}
        {searchResult.map((result, i) => (
          <div key={i}>{result}</div>
        ))}
      </div>
    </Modal>
  );
};
