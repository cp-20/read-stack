import { JSDOM } from 'jsdom';
import { z } from 'zod';
import type { Article } from '@/features/articles/fetchArticle';

const noteApiSchema = z.object({
  data: z.object({
    name: z.string(),
    body: z.string(),
    eyecatch: z.string().url(),
  }),
});

export const fetchArticleFromNote = async (url: string): Promise<Article> => {
  const { pathname } = new URL(url);
  const key = pathname.split('/').slice(-1)[0];

  const response = await fetch(`https://note.com/api/v3/notes/${key}`);
  const json = await response.json();
  const query = noteApiSchema.parse(json);

  const { name, body, eyecatch } = query.data;

  const textBody = new JSDOM(body).window.document.textContent ?? '';

  const article = {
    url,
    title: name,
    body: textBody,
    ogImageUrl: eyecatch,
  };

  return article;
};
