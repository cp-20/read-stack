import { css } from '@emotion/react';
import { Center, Text } from '@mantine/core';
import Image from 'next/image';
import NoContentImage from '~/public/assets/no-content.png';

export const NoContent = () => {
  return (
    <Center
      css={css`
          flex-direction: column;
        `}
      mt={16}
    >
      <Image alt="" src={NoContentImage} width={320} />
      <Text>現在未読の記事は存在しません</Text>
      <Text mt={8}>新しく記事を読むとここに追加されます</Text>
    </Center>
  );
};
