import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { userIdPathRouteHelper } from '@/routes/users/common';
import { RssItemSchema } from '@/schema';

export const deleteUserRssRequestBodySchema = z.object({
  url: z.string().openapi({
    description: '削除するRSSのURL',
    example: 'https://example.com/feed',
  }),
});

export const deleteUserRssResponseSchema = z.object({
  rss: RssItemSchema,
});

const deleteRssRouteBase = {
  method: 'delete',
  path: '/users/me/rss' as const,
  description: 'URLからRSSを削除します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: deleteUserRssRequestBodySchema,
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: deleteUserRssResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const deleteMyRssRoute = createRoute(deleteRssRouteBase);

export const deleteUserRssRoute = createRoute(
  userIdPathRouteHelper(deleteRssRouteBase),
);
