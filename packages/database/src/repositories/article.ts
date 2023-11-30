import { db } from '@/database/drizzleClient';
import { articles } from '@/models';

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

export interface ArticleInfo {
  url: string;
  title: string;
  body: string;
  summary?: string | null;
  ogImageUrl?: string | null;
}

export const createArticle = async (articleData: ArticleInfo) => {
  const article = await db
    .insert(articles)
    .values({ ...articleData, createdAt: new Date(), updatedAt: new Date() })
    .returning();

  return article[0];
};

export const saveArticleByUrl = async (
  url: string,
  getArticle: () => ArticleInfo | Promise<ArticleInfo>,
) => {
  const article = await findArticleByUrl(url);

  if (article !== undefined) {
    return article;
  }

  const newArticleData = await getArticle();

  const newArticle = await createArticle(newArticleData);

  return newArticle;
};
