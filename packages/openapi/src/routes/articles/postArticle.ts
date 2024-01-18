import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okJsonResponse,
} from '@/routes/helpers/response';
import { ArticleSchema } from '@/schema';

export const postArticleRequestBodySchema = z.object({
  url: z.string().url().openapi({
    example: 'https://example.com/slug',
  }),
});

export const postArticleResponseSchema = z.object({
  article: ArticleSchema,
});

export const postArticleRoute = createRoute({
  method: 'post',
  path: '/articles',
  description: '記事のURLから記事を登録します (内容は自動取得されます)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postArticleRequestBodySchema,
          example: {
            url: 'https://example.com/slug',
          },
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: postArticleResponseSchema,
    }),
    ...badRequestResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
});
