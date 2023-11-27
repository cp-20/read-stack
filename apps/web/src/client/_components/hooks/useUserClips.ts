import { getClipsResponseSchema } from '@openapi';
import type { clips } from '@prisma/client';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useId } from 'react';
import useSWRInfinite from 'swr/infinite';
import { z } from 'zod';
import type { ClipWithArticles } from '@/client/Home/_components/UnreadClips/UnreadClipListItem';
import { useUserData } from '@/features/supabase/auth';
import { ArticleSchema, ClipSchema } from '@/schema/article';

export type useUserClipsOptions = {
  limit?: number;
  unreadOnly?: boolean;
};

const updateClipsAtom = atom<Map<string, () => void>>(new Map());

export const useUserClips = (options?: useUserClipsOptions) => {
  const id = useId();
  const { user } = useUserData();
  const [, setUpdateClips] = useAtom(updateClipsAtom);

  const limit = options?.limit ?? 20;

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    const parsedData = getClipsResponseSchema.safeParse(data);
    return clips;
  };

  const { data, setSize, mutate, isLoading } = useSWRInfinite<
    ClipWithArticles[],
    unknown
  >(
    (size, acc: clips[][] | null) => {
      if (!user) return null;
      if ((size + 1) * limit <= (acc?.length ?? 0)) return null;
      // 最後に到達したらやめる
      if (acc?.slice(-1)[0]?.length === 0) return null;

      const cursorOption: { cursor: string } | Record<string, never> = acc
        ? { cursor: acc.flat().slice(-1)[0].id.toString() }
        : {};

      const url = new URLSearchParams({
        limit: limit.toString(),
        unreadOnly: options?.unreadOnly?.toString() ?? 'true',
        ...cursorOption,
      });

      return `/api/v1/users/me/clips?${url.toString()}`;
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

  return { clips, loadNext, isFinished, isLoading };
};

export const useAddClip = () => {
  const { user } = useUserData();
  const [updateClips] = useAtom(updateClipsAtom);

  const addClip = useCallback(
    async (url: string) => {
      if (user === null) return false;

      const res = await fetch(`/api/v1/users/${user.id}/clips`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'url',
          articleUrl: url,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseSchema = z.object({
        article: ArticleSchema,
        clip: ClipSchema,
      });

      const json = await res.json();
      const data = responseSchema.safeParse(json);

      if (!data.success) return null;

      updateClips.forEach((update) => update());

      return data.data;
    },
    [updateClips, user],
  );

  return { addClip };
};
