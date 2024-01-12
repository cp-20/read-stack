import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { ClipWithArticleSchema } from '@/schema';

// TODO
export const postClipRequestBodySchema = z.union([
  z.object({
    type: z.literal('id').optional(),
    articleId: z.number().int(),
  }),
  z.object({
    type: z.literal('url'),
    articleUrl: z.string().url(),
  }),
]);

export const postClipResponseSchema = z.object({
  clip: ClipWithArticleSchema,
});

const postUserClipRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/clips',
  description: 'クリップを作成します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postClipRequestBodySchema,
          examples: {
            'type-omitted': {
              articleId: 1,
            },
            'type="id"': {
              type: 'id' as const,
              articleId: 1,
            },
            'type="url"': {
              type: 'url' as const,
              articleUrl: 'https://zenn.dev/author-id/articles/slug',
            },
          },
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: postClipResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
};

export const postMyClipRoute = createRoute(postUserClipRouteBase);
