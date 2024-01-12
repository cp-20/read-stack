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

export const deleteInboxItemRequestParamsSchema = z.object({
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

export const deleteInboxItemResponseSchema = z.object({
  item: InboxItemSchema,
});

const deleteInboxItemRouteBase: RouteConfig = {
  method: 'delete',
  path: '/users/me/inboxes/:itemId',
  description: '受信箱のアイテムを削除します',
  request: {
    params: deleteInboxItemRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: deleteInboxItemResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
};

export const deleteMyInboxItemRoute = createRoute(deleteInboxItemRouteBase);

export const deleteUserInboxItemRoute = createRoute(
  userIdPathRouteHelper(deleteInboxItemRouteBase),
);
