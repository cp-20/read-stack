import { JSDOM } from 'jsdom';
import { z } from 'zod';

const qiitaApiSchema = z.object({
  title: z.string(),
  rendered_body: z.string(),
});

export const fetchArticleFromQiita = async (url: string) => {
  const { pathname } = new URL(url);
  const key = pathname.split('/').slice(-1)[0];

  const apiResponse = await fetch(`https://qiita.com/api/v2/items/${key}`);
  const json = await apiResponse.json();
  const query = qiitaApiSchema.parse(json);

  const { title, rendered_body: renderedBody } = query;

  const textBody = new JSDOM(renderedBody).window.document.textContent ?? '';

  const articleResponse = await fetch(url);
  const html = await articleResponse.text();
  const dom = new JSDOM(html);
  const ogImageUrl =
    dom.window.document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute('content') ?? null;

  const article = {
    url,
    title,
    body: textBody,
    ogImageUrl,
  };

  return article;
};
