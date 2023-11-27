import { css } from '@emotion/react';
import type { FC } from 'react';

import type { ClipWithArticles } from './UnreadClipListItem';
import { UnreadClipPanel } from './UnreadClipPanel';

export type UnreadClipPanelsProps = {
  clips: ClipWithArticles[];
};

export const UnreadClipPanels: FC<UnreadClipPanelsProps> = ({ clips }) => {
  return (
    <div
      css={css`
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      `}
    >
      {clips.map((clip) => (
        <UnreadClipPanel key={clip.id} clip={clip} />
      ))}
    </div>
  );
};
