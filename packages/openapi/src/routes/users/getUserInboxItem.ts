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
import { InboxItemSchema } from '@/schema';

export const getInboxItemRequestParamsSchema = z.object({
  itemId: z.string().openapi({
    param: {
      name: 'itemId',
      in: 'path',
      required: true,
      description: 'アイテムのID',
    },
    example: '1',
  }),
});

export const getInboxItemResponseSchema = z.object({
  item: InboxItemSchema,
});

export const getInboxItemRouteBase = {
  method: 'get',
  path: '/users/me/inboxes/:itemId' as const,
  description: '受信箱のアイテムを取得します',
  request: {
    params: getInboxItemRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getInboxItemResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const getMyInboxItemRoute = createRoute(getInboxItemRouteBase);

export const getUserInboxItemRoute = createRoute(
  userIdPathRouteHelper(getInboxItemRouteBase),
);
