import { fetchArticleFromNote } from '@/crawler/note';
import { fetchArticleFromQiita } from '@/crawler/qiita';
import { fetchUsingReadability } from '@/crawler/readability';
import { fetchArticleFromZenn } from '@/crawler/zenn';

export interface ArticleResponse {
  url: string;
  title: string;
  body: string;
  ogImageUrl: string | null;
}

// server-side only
export const fetchArticle = async (
  url: string,
): Promise<ArticleResponse | null> => {
  const { host } = new URL(url);

  if (host === 'note.com') {
    return fetchArticleFromNote(url);
  }

  if (host === 'qiita.com') {
    return fetchArticleFromQiita(url);
  }

  if (host === 'zenn.dev') {
    return fetchArticleFromZenn(url);
  }

  return fetchUsingReadability(url);
};
