import { saveArticleByUrl } from '@read-stack/database';
import { excludeFalsy, fetchArticle } from '@read-stack/lib';
import Parser from 'rss-parser';

const parser = new Parser();

export const fetchRss = (rssUrl: string) => parser.parseURL(rssUrl);

export const fetchRssContentArticles = async (articleUrls: string[]) => {
  const articles = excludeFalsy(
    await Promise.all(
      articleUrls.map(async (url) => {
        try {
          const article = await saveArticleByUrl(url, async () => {
            const a = await fetchArticle(url);
            if (a === null) throw new Error('article is null');
            return a;
          });
          return article;
        } catch (error) {
          console.error(error);
          return null;
        }
      }),
    ),
  );

  return articles;
};
