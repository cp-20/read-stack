import { fetcher } from '@/features/swr/fetcher';
import { getRssResponseSchema } from '@read-stack/openapi';
import useSWR from 'swr';

const rssFetcher = async (url: string) => {
  const res = await fetcher(url);
  const { rss } = getRssResponseSchema.parse(res);
  return rss;
};

const key = '/api/v1/users/me/rss';

export const useRssItems = () => {
  const { data, isLoading, mutate } = useSWR(key, rssFetcher);

  const addNewRss = (url: string, name: string | null) => {
    const mutating = fetch('/api/v1/users/me/rss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, name }),
    });

    void mutate(
      async () => {
        await mutating;
        return rssFetcher(key);
      },
      {
        optimisticData: (prev) => {
          if (prev === undefined) return [];
          return [
            ...prev,
            {
              createdAt: new Date(),
              updatedAt: new Date(),
              url,
              name: null,
              userId: '',
            },
          ];
        },
      },
    );
  };

  const deleteRss = (url: string) => {
    const mutating = fetch(`/api/v1/users/me/rss`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    void mutate(
      async () => {
        await mutating;
        return rssFetcher(key);
      },
      {
        optimisticData: (prev) => {
          if (prev === undefined) return [];
          return prev.filter((rssItem) => rssItem.url !== url);
        },
      },
    );
  };

  const refresh = () => {
    void mutate();
  };

  return {
    rssItems: data,
    isLoading,
    refresh,
    addNewRss,
    deleteRss,
  };
};
