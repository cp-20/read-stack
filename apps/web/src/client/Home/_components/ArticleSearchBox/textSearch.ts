import { fetcher } from '@/features/swr/fetcher';
import { toISOString } from '@/shared/lib/toIsoString';
import type { Article } from '@read-stack/openapi';
import {
  getInboxItemsResponseSchema,
  getClipsResponseSchema,
} from '@read-stack/openapi';
import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { z } from 'zod';

type ClipResponse = z.infer<typeof getClipsResponseSchema>;

const clipsGetKeyGenerator = (searchText: string) => {
  const text = encodeURIComponent(searchText);
  const base = `/api/v1/users/me/clips?text=${text}&limit=10`;

  return (_: number, prev: ClipResponse | null) => {
    if (searchText === '') return null;

    if (prev === null) return base;
    if (prev.finished) return null;
    const lastClip = prev.clips.at(-1);
    if (lastClip === undefined) return null;
    const before = encodeURIComponent(toISOString(lastClip.updatedAt));
    return `${base}&before=${before}`;
  };
};

const clipsFetcher = async (url: string) => {
  const res = await fetcher(url);
  const result = getClipsResponseSchema.parse(res);
  return result;
};

const useClipTextSearch = (searchText: string) => {
  const { data, setSize, mutate, isLoading } = useSWRInfinite(
    clipsGetKeyGenerator(searchText),
    clipsFetcher,
  );

  const clips = data?.flatMap((d) => d.clips) ?? [];

  const reset = useCallback(() => {
    void setSize(1);
    void mutate();
  }, [mutate, setSize]);

  const loadNext = useCallback(() => {
    void setSize((size) => size + 1);
  }, [setSize]);

  return {
    clips,
    reset,
    loadNext,
    isLoading,
  };
};

type InboxResponse = z.infer<typeof getInboxItemsResponseSchema>;

const inboxGetKeyGenerator = (searchText: string) => {
  const text = decodeURIComponent(searchText);
  const base = `/api/v1/users/me/inboxes?text=${text}&limit=10`;
  return (_: number, prev: InboxResponse | null) => {
    if (searchText === '') return null;

    if (prev === null) return base;
    if (prev.finished) return null;
    const lastClip = prev.items.at(-1);
    if (lastClip === undefined) return null;
    const before = encodeURIComponent(toISOString(lastClip.updatedAt));
    return `${base}&before=${before}`;
  };
};

const inboxFetcher = async (url: string) => {
  const res = await fetcher(url);
  const result = getInboxItemsResponseSchema.parse(res);
  return result;
};

const useInboxTextSearch = (searchText: string) => {
  const { data, setSize, mutate, isLoading } = useSWRInfinite(
    inboxGetKeyGenerator(searchText),
    inboxFetcher,
  );

  const items = data?.flatMap((d) => d.items) ?? [];

  const reset = useCallback(() => {
    void setSize(1);
    void mutate();
  }, [mutate, setSize]);

  const loadNext = useCallback(() => {
    void setSize((size) => size + 1);
  }, [setSize]);

  return {
    items,
    reset,
    loadNext,
    isLoading,
  };
};

export type SearchResultArticle = {
  type: 'inbox' | 'unread' | 'read';
} & Article;

export const useTextSearch = (searchText: string) => {
  const {
    clips,
    loadNext: loadNextClips,
    isLoading: isClipsLoading,
  } = useClipTextSearch(searchText);
  const {
    items,
    loadNext: loadNextInbox,
    isLoading: isInboxLoading,
  } = useInboxTextSearch(searchText);

  const inboxArticles: SearchResultArticle[] = items.map((item) => ({
    ...item.article,
    type: 'inbox',
  }));
  const clipArticles: SearchResultArticle[] = clips.map((clip) => ({
    ...clip.article,
    type: clip.status === 2 ? 'read' : 'unread',
  }));
  const articles = [...clipArticles, ...inboxArticles];

  const loadNext = useCallback(() => {
    loadNextClips();
    loadNextInbox();
  }, [loadNextClips, loadNextInbox]);

  const isLoading = isClipsLoading || isInboxLoading;

  return {
    articles,
    loadNext,
    isLoading,
  };
};
