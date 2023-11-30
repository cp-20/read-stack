import {
  getClipsResponseSchema,
  postClipResponseSchema,
} from '@read-stack/openapi';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useId } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { z } from 'zod';
import { useUserData } from '@/features/supabase/auth';

export interface UseUserClipsOptions {
  limit?: number;
  unreadOnly?: boolean;
}

const updateClipsAtom = atom<Map<string, () => void>>(new Map());

type GetClipsResponse = z.infer<typeof getClipsResponseSchema>;

export const useUserClips = (options?: UseUserClipsOptions) => {
  const id = useId();
  const { user } = useUserData();
  const [, setUpdateClips] = useAtom(updateClipsAtom);

  const limit = options?.limit ?? 20;

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const parsedData = getClipsResponseSchema.safeParse(await res.json());

    if (!parsedData.success) {
      console.error(parsedData.error);
      return { clips: [], finished: false };
    }

    return parsedData.data;
  };

  const { data, setSize, mutate, isLoading } = useSWRInfinite<
    GetClipsResponse,
    unknown
  >(
    (_size, acc?: GetClipsResponse) => {
      if (!user) return null;
      // 最後に到達したらやめる
      if (acc?.finished) return null;

      const cursor = acc?.clips.slice(-1)[0]?.id.toString();
      const cursorOption: { cursor?: string } = cursor ? { cursor } : {};

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

  const clips = data ? data.flatMap((d) => d.clips) : [];

  const loadNext = useCallback(() => setSize((size) => size + 1), [setSize]);

  const isFinished = data?.slice(-1)[0]?.finished;

  // TODO: この実装はちょっとどうなんだろう
  const updateClip = useCallback(() => {
    void setSize(1);
    void mutate();
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

      const res = await fetch(`/api/v1/users/me/clips`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'url',
          articleUrl: url,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = postClipResponseSchema.safeParse(await res.json());

      if (!data.success) return null;

      updateClips.forEach((update) => {
        update();
      });

      return data.data;
    },
    [updateClips, user],
  );

  return { addClip };
};
