import { useUserClips } from '@/client/_components/hooks/useUserClips';

export const Status = () => {
  const { clips } = useUserClips();

  return (
    <div>
      <div>今まで読んだ記事の数: {clips.length}</div>
    </div>
  );
};
