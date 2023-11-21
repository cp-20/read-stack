import { load } from 'cheerio';
import type { ArticleResponse } from '.';

export const fetchArticleFromOther = async (
  url: string,
): Promise<ArticleResponse> => {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  // TODO: null or undefinedのときの処理
  const title = $('h1').text();

  // TODO: うまくbodyを取得する
  const body = $('body').text();

  const ogImageUrl = $('meta[property="og:image"]').attr('content') ?? null;

  const article = {
    url,
    title,
    body,
    ogImageUrl,
  };

  return article;
};
