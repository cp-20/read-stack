import { fetchArticleFromNote } from '@/crawler/note';
import { fetchArticleFromQiita } from '@/crawler/qiita';
import { fetchUsingReadability } from '@/crawler/readability';
import { trimUrl } from '@/crawler/trim';
import { fetchArticleFromZenn } from '@/crawler/zenn';

export interface ArticleResponse {
  url: string;
  title: string;
  body: string;
  ogImageUrl: string | null;
}

// server-side only
export const fetchArticle = async (
  url: string
): Promise<ArticleResponse | null> => {
  const trimmedUrl = trimUrl(url);

  if (/https?:\/\/note.com\/[^/]+\/n\/[^/]+/.exec(trimmedUrl)) {
    return fetchArticleFromNote(trimmedUrl);
  }

  if (/https?:\/\/qiita.com\/[^/]+\/items\/[^/]+/.exec(trimmedUrl)) {
    return fetchArticleFromQiita(trimmedUrl);
  }

  if (/https?:\/\/zenn.dev\/[^/]+\/articles\/[^/]+/.exec(trimmedUrl)) {
    return fetchArticleFromZenn(trimmedUrl);
  }

  return fetchUsingReadability(trimmedUrl);
};
