import { fetchArticleFromNote } from './note';
import { fetchArticleFromOther } from './other';
import { fetchArticleFromQiita } from './qiita';
import { fetchArticleFromZenn } from './zenn';

export type ArticleResponse = {
  url: string;
  title: string;
  body: string;
  ogImageUrl: string | null;
};

// server-side only
export const fetchArticle = async (url: string) => {
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

  return fetchArticleFromOther(url);
};
