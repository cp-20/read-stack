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
  path: '/users/me/rss',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postRssRequestBodySchema,
          example: {
            url: 'https://example.com/rss',
            name: 'Example RSS',
          },
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: postRssResponseSchema,
      example: {
        rss: {
          id: 1,
          url: 'https://example.com/rss',
          name: 'Example RSS',
          createdAt: '2021-01-01T00:00:00Z',
          updatedAt: '2021-01-01T00:00:00Z',
        },
      },
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
};

export const postMyRssRoute = createRoute(postRssRouteBase);

export const postUserRssRoute = createRoute(
  userIdPathRouteHelper(postRssRouteBase),
);
