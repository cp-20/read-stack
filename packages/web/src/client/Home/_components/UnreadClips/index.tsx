import type { FC } from 'react';
import { UnreadClipList } from './UnreadClipList';
import { useUserClips } from '@/client/_components/hooks/useUserClips';

export const UnreadClips: FC = () => {
  const { clips } = useUserClips({ unreadOnly: true });

  return <UnreadClipList clips={clips} />;
};
