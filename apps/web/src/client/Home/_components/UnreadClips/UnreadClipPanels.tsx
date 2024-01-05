import { css } from '@emotion/react';
import type { FC } from 'react';
import type { ClipWithArticle } from '@read-stack/openapi';
import { UnreadClipPanel } from './UnreadClipPanel';

export interface UnreadClipPanelsProps {
  clips: ClipWithArticle[];
}

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
        <UnreadClipPanel clip={clip} key={clip.id} />
      ))}
    </div>
  );
};
