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
  const article = await db.insert(articles).values(articleData);

  return article;
};

export const saveArticleByUrl = async (
  url: string,
  getArticle: () => Article | Promise<Article>,
) => {
  const article = await findArticleByUrl(url);

  if (article !== null) {
    return { exist: true, article };
  }

  const newArticleData = await getArticle();

  const newArticle = await createArticle(newArticleData);

  return { exist: false, article: newArticle };
};
