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

export const moveInboxItemToClipRequestParamsSchema = z.object({
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

export const moveInboxItemToClipResponseSchema = z.object({
  item: InboxItemSchema,
});

const moveInboxItemToClipRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/inboxes/:itemId',
  description: '受信箱のアイテムをスタックに移動します',
  request: {
    params: moveInboxItemToClipRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: moveInboxItemToClipResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
};

export const moveMyInboxItemToClipRoute = createRoute(
  moveInboxItemToClipRouteBase,
);

export const moveUserInboxItemToClipRoute = createRoute(
  userIdPathRouteHelper(moveInboxItemToClipRouteBase),
);
