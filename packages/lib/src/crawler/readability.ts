import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

import type { ArticleResponse } from '@/crawler';

export const fetchUsingReadability = async (
  url: string,
): Promise<ArticleResponse | null> => {
  const response = await fetch(url);
  const html = await response.text();

  const dom = new JSDOM(html);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const ogImageUrl =
    dom.window.document.querySelector<HTMLMetaElement>(
      'meta[property="og:image"]',
    )?.content ?? null;

  if (article === null) return null;

  return {
    title: article.title,
    body: article.textContent,
    url,
    ogImageUrl,
  };
};
