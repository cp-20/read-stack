import type { OpenAPIHono } from '@hono/zod-openapi';
import { getArticleRoute, postArticleRoute } from '@openapi';

export const registerArticlesHandlers = (app: OpenAPIHono) => {
  app.openapi(getArticleRoute, async (c) => {
    const articleId = c.req.param('articleId');
  });

  app.openapi(postArticleRoute, async (c) => {});
};
