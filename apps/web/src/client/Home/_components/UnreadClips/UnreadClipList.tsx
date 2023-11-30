import { Stack } from '@mantine/core';
import type { FC } from 'react';
import type { ClipWithArticle } from '@read-stack/openapi';
import { UnreadClipListItem } from './UnreadClipListItem';

export interface UnreadClipListProps {
  clips: ClipWithArticle[];
}

export const UnreadClipList: FC<UnreadClipListProps> = ({ clips }) => {
  return (
    <Stack>
      {clips.map((clip) => (
        <UnreadClipListItem clip={clip} key={clip.id} />
      ))}
    </Stack>
  );
};
