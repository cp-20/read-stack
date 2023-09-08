import type { Article } from '@/features/articles/fetchArticle';
import { prisma } from '@/features/database/prismaClient';

export const findArticleById = async (id: number) => {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
  });

  return article;
};

export const findArticleByUrl = async (url: string) => {
  const article = await prisma.article.findUnique({
    where: {
      url,
    },
  });

  return article;
};

export const createArticle = async (articleData: Article) => {
  const article = await prisma.article.create({
    data: articleData,
  });

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
