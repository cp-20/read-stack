import type { clips } from '@prisma/client';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useId } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { ClipWithArticles } from '@/client/Home/_components/UnreadClips/UnreadClipListItem';
import { useUserData } from '@/features/supabase/auth';
import { ArticleSchema, ClipSchema } from '@/schema/article';
import type { ClipSearchQuery } from '@/schema/clipSearchQuery';

export type useUserClipsOptions = {
  limit?: number;
  query?: ClipSearchQuery;
};

const updateClipsAtom = atom<Map<string, () => void>>(new Map());

export const useUserClips = (options?: useUserClipsOptions) => {
  const id = useId();
  const { user } = useUserData();
  const [, setUpdateClips] = useAtom(updateClipsAtom);

  const limit = options?.limit ?? 20;

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    // TODO: アサーションを上手く回避したいね
    const { clips } = (await res.json()) as { clips: ClipWithArticles[] };
    return clips;
  };

  const { data, setSize, mutate } = useSWRInfinite<ClipWithArticles[], unknown>(
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
      fetcher,
      initialSize: 1,
    },
  );

  const clips = data ? data.flat() : [];

  const loadNext = useCallback(() => setSize((size) => size + 1), [setSize]);

  const isFinished = data?.slice(-1)[0]?.length === 0;

  // TODO: この実装はちょっとどうなんだろう
  const updateClip = useCallback(() => {
    setSize(1);
    mutate();
  }, [mutate, setSize]);

  useEffect(() => {
    setUpdateClips((prev) => new Map(prev).set(id, updateClip));
  }, [id, setUpdateClips, updateClip]);

  return { clips, loadNext, isFinished };
};

export const useAddClip = () => {
  const { user } = useUserData();
  const [updateClips] = useAtom(updateClipsAtom);

  const addClip = useCallback(
    async (url: string) => {
      if (user === null) return false;

      const body = { url };
      const articleRes = await fetch('/api/v1/articles', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const articleJson = await articleRes.json();

      const articleData = ArticleSchema.safeParse(articleJson);
      if (!articleData.success) return 0;

      const article = articleData.data;

      const clipRes = await fetch(`/api/v1/users/${user.id}/clips`, {
        method: 'POST',
        body: JSON.stringify({ articleId: article.id }),
      });

      const clipJson = await clipRes.json();
      const clipData = ClipSchema.safeParse(clipJson);

      if (!clipData.success) return null;

      const clip = clipData.data;

      updateClips.forEach((update) => update());

      return { clip, article };
    },
    [updateClips, user],
  );

  return { addClip };
};

export const useDeleteClip = () => {
  const { user } = useUserData();
  const [updateClips] = useAtom(updateClipsAtom);

  const deleteClip = useCallback(
    async (clipId: number) => {
      if (user === null) return false;

      const res = await fetch(`/api/v1/users/${user.id}/clips/${clipId}`, {
        method: 'DELETE',
      });

      if (res.status !== 200) return false;

      const clipJson = await res.json();
      const clipData = ClipSchema.safeParse(clipJson.clip);

      if (!clipData.success) return false;

      const clip = clipData.data;

      updateClips.forEach((update) => update());

      return { clip };
    },
    [updateClips, user],
  );

  return { deleteClip };
};
