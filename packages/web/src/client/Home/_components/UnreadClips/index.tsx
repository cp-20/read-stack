import { css } from '@emotion/react';
import { Center, Loader, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import Image from 'next/image';
import { useEffect, type FC } from 'react';
import { UnreadClipList } from './UnreadClipList';
import { useUserClips } from '@/client/_components/hooks/useUserClips';
import NoContentImage from '/public/assets/no-content.png';

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
      {!isLoading && clips.length === 0 && (
        <Center
          mt={16}
          css={css`
            flex-direction: column;
          `}
        >
          <Image src={NoContentImage} alt="" width={320} />
          <Text>現在未読の記事は存在しません</Text>
          <Text mt={8}>新しく記事を読むとここに追加されます</Text>
        </Center>
      )}
      {isLoading && (
        <Center mt={16} ref={ref}>
          <Loader variant="oval" />
        </Center>
      )}
    </>
  );
};
