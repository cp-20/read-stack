import { JSDOM } from 'jsdom';
import type { Article } from '@/features/articles/fetchArticle';

export const fetchArticleFromOther = async (url: string): Promise<Article> => {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);

  // TODO: null or undefinedのときの処理
  const title = dom.window.document.querySelector('h1')?.textContent ?? '???';

  // TODO: うまくbodyを取得する
  const body = dom.window.document.querySelector('body')?.textContent ?? '';

  const ogImageUrl =
    dom.window.document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute('content') ?? null;

  const article = {
    url,
    title,
    body,
    ogImageUrl,
  };

  return article;
};
