import { load } from 'cheerio';
import { z } from 'zod';

const zennApiSchema = z.object({
  article: z.object({
    title: z.string(),
    body_html: z.string(),
    og_image_url: z.string().url(),
  }),
});

export const fetchArticleFromZenn = async (url: string) => {
  const { pathname } = new URL(url);
  const key = pathname.split('/').slice(-1)[0];

  const apiResponse = await fetch(`https://zenn.dev/api/articles/${key}`);
  const query = zennApiSchema.parse(await apiResponse.json());

  const { title, body_html: body, og_image_url: ogImageUrl } = query.article;

  const textBody = load(body)('body').text();

  const article = {
    url,
    title,
    body: textBody,
    ogImageUrl,
  };

  return article;
};
