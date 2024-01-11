import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  internalServerErrorResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { userIdPathRouteHelper } from '@/routes/users/common';
import { RssItemSchema } from '@/schema';

export const getRssResponseSchema = z.object({
  user: z.array(RssItemSchema),
});

const getRssRouteBase: RouteConfig = {
  method: 'get',
  path: '/users/me/rss',
  responses: {
    ...okJsonResponse({
      schema: getRssResponseSchema,
      example: {
        rss: [
          {
            id: 1,
            url: 'https://example.com/rss',
            name: 'Example RSS',
            createdAt: '2021-01-01T00:00:00Z',
            updatedAt: '2021-01-01T00:00:00Z',
          },
          {
            id: 2,
            url: 'https://example.co.jp/rss',
            createdAt: '2021-01-01T00:00:00Z',
            updatedAt: '2021-01-01T00:00:00Z',
          },
        ],
      },
    }),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
};

export const getMyRssRoute = createRoute(getRssRouteBase);

export const getUserRssRoute = createRoute(
  userIdPathRouteHelper(getRssRouteBase),
);
