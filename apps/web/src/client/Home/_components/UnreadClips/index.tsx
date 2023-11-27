import { Center, Loader } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import type { ReactNode, FC } from 'react';
import { useEffect } from 'react';
import { UnreadClipList } from './UnreadClipList';
import { NoContent } from '@/client/Home/_components/UnreadClips/NoContent';
import { UnreadClipPanels } from '@/client/Home/_components/UnreadClips/UnreadClipPanels';
import { useUserClips } from '@/client/_components/hooks/useUserClips';

export type UnreadClipViewType = 'panel' | 'list';

export type UnreadClipsProps = {
  type: UnreadClipViewType;
  includeRead?: boolean;
};

export const UnreadClips: FC<UnreadClipsProps> = ({ type, includeRead }) => {
  const { ref, entry } = useIntersection({
    threshold: 0,
  });

  const { clips, loadNext, isLoading } = useUserClips({
    unreadOnly: !includeRead,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      loadNext();
    }
  }, [entry?.isIntersecting, loadNext]);

  const views: Record<UnreadClipViewType, ReactNode> = {
    panel: <UnreadClipPanels clips={clips} />,
    list: <UnreadClipList clips={clips} />,
  };

  const UnreadClipView = views[type];

  return (
    <>
      {UnreadClipView}
      {!isLoading && clips.length === 0 && <NoContent />}
      {isLoading && (
        <Center mt={16} ref={ref}>
          <Loader variant="oval" />
        </Center>
      )}
    </>
  );
};
