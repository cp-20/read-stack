import { css } from '@emotion/react';
import { Center, Text } from '@mantine/core';
import NoContentImage from '/public/assets/no-content.png';
import Image from 'next/image';

export const NoContent = () => {
  return (
    <>
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
    </>
  );
};
