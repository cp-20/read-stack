import { Stack } from '@mantine/core';
import type { FC } from 'react';

import type { ClipWithArticles } from './UnreadClipListItem';
import { UnreadClipListItem } from './UnreadClipListItem';

export type UnreadClipListProps = {
  clips: ClipWithArticles[];
};

export const UnreadClipList: FC<UnreadClipListProps> = ({ clips }) => {
  return (
    <Stack>
      {clips.map((clip) => (
        <UnreadClipListItem key={clip.id} clip={clip} />
      ))}
    </Stack>
  );
};
