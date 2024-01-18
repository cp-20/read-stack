import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute, z } from '@hono/zod-openapi';

import {
  badRequestResponse,
  internalServerErrorResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { userIdPathRouteHelper } from '@/routes/users/common';
import { RssItemSchema } from '@/schema';

export const postRssRequestBodySchema = RssItemSchema.pick({
  url: true,
  name: true,
});

export const postRssResponseSchema = z.object({
  rss: RssItemSchema,
});

const postRssRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/rss' as const,
  description: 'RSSを登録します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postRssRequestBodySchema,
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: postRssResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const postMyRssRoute = createRoute(postRssRouteBase);

export const postUserRssRoute = createRoute(
  userIdPathRouteHelper(postRssRouteBase),
);
