import { NoContent } from '@/client/Home/_components/UnreadClips/NoContent';
import { UnreadClipPanels } from '@/client/Home/_components/UnreadClips/UnreadClipPanels';
import { useUserClips } from '@/client/_components/hooks/useUserClips';
import { Center, Loader } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { UnreadClipList } from './UnreadClipList';

export type UnreadClipViewType = 'panel' | 'list';

export interface UnreadClipsProps {
  type: UnreadClipViewType;
  includeRead?: boolean;
}

export const UnreadClips: FC<UnreadClipsProps> = ({ type, includeRead }) => {
  const { ref, entry } = useIntersection({
    threshold: 0,
  });

  const { clips, loadNext, isLoading } = useUserClips({
    unreadOnly: !includeRead,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- entryがnullのときがある
    if (entry?.isIntersecting) {
      void loadNext();
    }
  }, [entry, loadNext]);

  const views: Record<UnreadClipViewType, ReactNode> = {
    panel: <UnreadClipPanels clips={clips} />,
    list: <UnreadClipList clips={clips} />,
  };

  const UnreadClipView = views[type];

  return (
    <>
      {UnreadClipView}
      {!isLoading && clips.length === 0 && <NoContent />}
      {isLoading ? (
        <Center mt={16} ref={ref}>
          <Loader variant="oval" />
        </Center>
      ) : null}
    </>
  );
};
