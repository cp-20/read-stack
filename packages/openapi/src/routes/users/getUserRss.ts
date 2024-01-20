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
  rss: z.array(RssItemSchema),
});

const getRssRouteBase = {
  method: 'get',
  path: '/users/me/rss' as const,
  operationId: 'getMyRss',
  description: '登録されているRSSの一覧を取得します',
  responses: {
    ...okJsonResponse({
      schema: getRssResponseSchema,
    }),
    ...unauthorizedResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const getMyRssRoute = createRoute(getRssRouteBase);

export const getUserRssRoute = createRoute(
  userIdPathRouteHelper(getRssRouteBase),
);
