import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okJsonResponse,
} from '@/routes/helpers/response';
import { ArticleSchema } from '@/schema';

export const getArticleRequestParamsSchema = z.object({
  articleId: z.string().openapi({
    param: {
      name: 'articleId',
      in: 'path',
      required: true,
      description: '記事のID',
    },
    example: '1',
  }),
});

export const getArticleResponseSchema = z.object({
  article: ArticleSchema,
});

export const getArticleRoute = createRoute({
  method: 'get',
  path: '/articles/:articleId',
  description: '記事のIDから記事を取得します',
  request: {
    params: getArticleRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getArticleResponseSchema,
    }),
    ...badRequestResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
});
