import { isMatch } from 'picomatch';

export interface TrimData {
  host: string[];
  queries: string[];
}

const trimData: TrimData[] = [
  {
    host: ['*'],
    queries: [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ],
  },
  {
    host: ['twitter.com', 'x.com'],
    queries: ['s', 't'],
  },
];

export const trimUrl = (url: string): string => {
  const urlObj = new URL(url);
  const data = trimData.filter((d) => isMatch(urlObj.host, d.host));

  data.forEach(({ queries }) => {
    queries.forEach((query) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where -- drizzle関係なし
      urlObj.searchParams.delete(query);
    });
  });

  return urlObj.toString();
};
