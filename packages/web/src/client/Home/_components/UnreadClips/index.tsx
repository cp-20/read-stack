import { Center, Loader } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useEffect, type FC } from 'react';
import { UnreadClipList } from './UnreadClipList';
import { NoContent } from '@/client/Home/_components/UnreadClips/NoContent';
import { useUserClips } from '@/client/_components/hooks/useUserClips';

export const UnreadClips: FC = () => {
  const { ref, entry } = useIntersection({
    threshold: 0,
  });

  const { clips, loadNext, isLoading } = useUserClips({
    query: { unreadOnly: true },
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      loadNext();
    }
  }, [entry?.isIntersecting, loadNext]);

  return (
    <>
      <UnreadClipList clips={clips} />
      {!isLoading && clips.length === 0 && <NoContent />}
      {isLoading && (
        <Center mt={16} ref={ref}>
          <Loader variant="oval" />
        </Center>
      )}
    </>
  );
};
