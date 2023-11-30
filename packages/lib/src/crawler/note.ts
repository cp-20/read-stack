import { load } from 'cheerio';
import { z } from 'zod';

import type { ArticleResponse } from '.';

const noteApiSchema = z.object({
  data: z.object({
    name: z.string(),
    body: z.string(),
    eyecatch: z.string().url(),
  }),
});

export const fetchArticleFromNote = async (
  url: string
): Promise<ArticleResponse> => {
  const { pathname } = new URL(url);
  const key = pathname.split('/').slice(-1)[0];

  const response = await fetch(`https://note.com/api/v3/notes/${key}`);
  const query = noteApiSchema.parse(await response.json());

  const { name, body, eyecatch } = query.data;

  const textBody = load(body)('body').text();

  const article = {
    url,
    title: name,
    body: textBody,
    ogImageUrl: eyecatch,
  };

  return article;
};
