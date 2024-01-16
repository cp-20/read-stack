import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { InboxItemSchema } from '@/schema';

export const postInboxItemRequestBodySchema = z.union([
  z.object({
    type: z.literal('id').optional(),
    articleId: z.number().int(),
  }),
  z.object({
    type: z.literal('url'),
    articleUrl: z.string().url(),
  }),
]);

export const postInboxItemResponseSchema = z.object({
  item: InboxItemSchema,
});

const postInboxItemRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/inboxes' as const,
  description: '受信箱にアイテムを追加します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postInboxItemRequestBodySchema,
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
      schema: postInboxItemResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const postMyInboxItemRoute = createRoute(postInboxItemRouteBase);
