import { load } from 'cheerio';
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

  const { title, rendered_body: body } = query;

  const textBody = load(body)('body').text();

  const articleResponse = await fetch(url);
  const html = await articleResponse.text();
  const ogImageUrl =
    load(html)('meta[property="og:image"]').attr('content') ?? null;

  const article = {
    url,
    title,
    body: textBody,
    ogImageUrl,
  };

  return article;
};
