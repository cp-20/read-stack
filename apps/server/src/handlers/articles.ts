import type { OpenAPIHono } from '@hono/zod-openapi';
import { createArticle, findArticleById } from '@read-stack/database';
import { fetchArticle, parseIntWithDefaultValue } from '@read-stack/lib';
import {
  getArticleRoute,
  postArticleRequestBodySchema,
  postArticleRoute,
} from '@read-stack/openapi';

import { app } from '@/index';
import { parseBody } from '@/handlers/helpers/parseBody';

export const registerArticlesHandlers = (_app: OpenAPIHono) => {
  app.openapi(getArticleRoute, async (c) => {
    const articleIdStr = c.req.param('articleId');
    const articleId = parseIntWithDefaultValue(articleIdStr, null);
    if (articleId === null) {
      return c.json({ error: 'articleId is not configured or valid' }, 400);
    }

    const article = await findArticleById(articleId);

    if (article === undefined) {
      return c.json({ error: 'article not found' }, 404);
    }

    return c.json({ article }, 200);
  });

  app.openapi(postArticleRoute, async (c) => {
    const body = await parseBody(c, postArticleRequestBodySchema);
    if (body === null) return c.json({ error: 'body is not valid' }, 400);

    const { url } = body;

    const articleInfo = await fetchArticle(url);

    if (articleInfo === null) {
      return c.json({ error: 'article not found' }, 404);
    }

    const createdArticle = await createArticle(articleInfo);

    return c.json({ article: createdArticle }, 200);
  });
};
