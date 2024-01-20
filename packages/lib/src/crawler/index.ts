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
  if (/https?:\/\/note.com\/[^/]+\/n\/[^/]+/.exec(url)) {
    return fetchArticleFromNote(url);
  }

  if (/https?:\/\/qiita.com\/[^/]+\/items\/[^/]+/.exec(url)) {
    return fetchArticleFromQiita(url);
  }

  if (/https?:\/\/zenn.dev\/[^/]+\/articles\/[^/]+/.exec(url)) {
    return fetchArticleFromZenn(url);
  }

  return fetchUsingReadability(url);
};
