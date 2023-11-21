import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  badRequestResponse,
  internalServerErrorResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@openapi/routes/helpers/response';
import { ClipSchema } from '@openapi/schema';
import { z } from 'zod';

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
  clip: ClipSchema,
});

const postUserClipRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/clips',
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
      example: {
        clip: {
          id: 1,
          status: 0,
          progress: 0,
          comment: 'This is a comment',
          articleId: 1,
          authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
          createdAt: '2023-11-15T09:05:15.452Z',
          updatedAt: '2023-11-15T09:05:15.452Z',
        },
      },
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
};

export const postMyClipRoute = createRoute(postUserClipRouteBase);
