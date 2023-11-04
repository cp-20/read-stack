import type { Article } from '@/features/articles/fetchArticle';
import { db } from '@/features/database/drizzleClient';
import { articles } from '@/features/database/models';

export const findArticleById = async (id: number) => {
  const article = await db.query.articles.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  });

  return article;
};

export const findArticleByUrl = async (url: string) => {
  const article = await db.query.articles.findFirst({
    where: (fields, { eq }) => eq(fields.url, url),
  });

  return article;
};

export const createArticle = async (articleData: Article) => {
  const article = await db.insert(articles).values(articleData).returning({
    id: articles.id,
    url: articles.url,
    title: articles.title,
    body: articles.body,
    summary: articles.summary,
    ogImageUrl: articles.ogImageUrl,
    createdAt: articles.createdAt,
  });

  return article[0];
};

export const saveArticleByUrl = async (
  url: string,
  getArticle: () => Article | Promise<Article>,
) => {
  const article = await findArticleByUrl(url);

  if (article !== undefined) {
    return { exist: true, article };
  }

  const newArticleData = await getArticle();

  const newArticle = await createArticle(newArticleData);

  return { exist: false, article: newArticle };
};
