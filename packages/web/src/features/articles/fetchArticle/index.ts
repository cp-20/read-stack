import { fetchArticleFromNote } from '@/features/articles/fetchArticle/note';
import { fetchArticleFromOther } from '@/features/articles/fetchArticle/other';
import { fetchArticleFromQiita } from '@/features/articles/fetchArticle/qiita';
import { fetchArticleFromZenn } from '@/features/articles/fetchArticle/zenn';

export type Article = {
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
