import type { clips } from '@prisma/client';
import useSWRInfinite from 'swr/infinite';
import type { ClipWithArticles } from '@/client/Home/_components/UnreadClips/UnreadClipListItem';
import { useUserData } from '@/features/supabase/auth';
import type { ClipSearchQuery } from '@/schema/clipSearchQuery';

export type useArticlesOptions = {
  limit?: number;
  query?: ClipSearchQuery;
};

export const useUserClips = (options?: useArticlesOptions) => {
  const limit = options?.limit ?? 20;

  const { user } = useUserData();

  const { data, setSize } = useSWRInfinite<ClipWithArticles[], unknown>(
    (size, acc: clips[][] | null) => {
      if (!user) return null;
      if ((size + 1) * limit <= (acc?.length ?? 0)) return null;
      // 最後に到達したらやめる
      if (acc?.slice(-1)[0]?.length === 0) return null;

      const cursorOption: { cursor: string } | Record<string, never> = acc
        ? { cursor: acc.flat().slice(-1)[0].id.toString() }
        : {};

      const queryOption: { query: string } | undefined = options?.query
        ? { query: JSON.stringify(options?.query) }
        : undefined;

      const url = new URLSearchParams({
        limit: limit.toString(),
        ...queryOption,
        ...cursorOption,
      });

      return `/api/v1/users/${user.id}/clips?${url.toString()}`;
    },
    {
      fetcher: async (url: string) => {
        const res = await fetch(url);
        // TODO: アサーションを上手く回避したいね
        const { clips } = (await res.json()) as { clips: ClipWithArticles[] };
        return clips;
      },
      initialSize: 1,
    },
  );

  const clips = data ? data.flat() : [];

  const loadNext = () => setSize((size) => size + 1);

  const isFinished = data?.slice(-1)[0]?.length === 0;

  return { clips, loadNext, isFinished };
};
