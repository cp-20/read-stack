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
  url: z.string().url(),
});

export const postArticleResponseSchema = z.object({
  article: ArticleSchema,
});

export const postArticleRoute = createRoute({
  method: 'post',
  path: '/articles',
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
