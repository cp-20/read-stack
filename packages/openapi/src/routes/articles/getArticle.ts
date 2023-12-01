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
  articleId: z.string(),
});

export const getArticleResponseSchema = z.object({
  article: ArticleSchema,
});

export const getArticleRoute = createRoute({
  method: 'get',
  path: '/articles/:articleId',
  request: {
    params: getArticleRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getArticleResponseSchema,
      example: {
        article: {
          id: 1,
          title: 'title',
          url: 'https://example.com/slug',
          createdAt: '2023-11-15T09:05:15.452Z',
          updatedAt: '2023-11-15T09:05:15.452Z',
        },
      },
    }),
    ...badRequestResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
});