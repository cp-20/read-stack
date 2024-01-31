import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { decode } from 'iconv-lite';

import type { ArticleResponse } from '@/crawler';

const additionalCharset = ['shift_jis', 'euc-jp'];
const additionalCharsetRegex = additionalCharset.map((c) => new RegExp(c, 'i'));

const detectCharset = (document: Document) => {
  const html4 = document
    .querySelector('meta[http-equiv="content-type"]')
    ?.getAttribute('content')
    ?.match(/charset=(?<charset>.+)/)?.[1];
  const html5 = document
    .querySelector('meta[charset]')
    ?.getAttribute('charset');
  const charset = html4 ?? html5 ?? null;
  const isAdditionalCharset = additionalCharsetRegex.map(
    (r) => charset !== null && r.test(charset),
  );

  return isAdditionalCharset.reduce(
    (prev, current, i) => (current ? additionalCharset[i] : prev),
    'utf-8',
  );
};

const parseArticle = (
  url: string,
  document: Document,
): ArticleResponse | null => {
  const reader = new Readability(document);
  const article = reader.parse();

  if (article === null) return null;

  const ogImageUrl =
    document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
      ?.content ?? null;

  return {
    url,
    title: article.title,
    body: article.content,
    ogImageUrl,
  };
};

const decoder = new TextDecoder();

export const fetchUsingReadability = async (
  url: string,
): Promise<ArticleResponse | null> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const html = decoder.decode(arrayBuffer);

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const charset = detectCharset(document);
  if (charset !== 'utf-8') {
    const html2 = decode(Buffer.from(arrayBuffer), charset);
    const dom2 = new JSDOM(html2);
    const document2 = dom2.window.document;

    return parseArticle(url, document2);
  }

  return parseArticle(url, document);
};
