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
import { ClipSchema } from '@/schema';

export const archiveInboxItemRequestParamsSchema = z.object({
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

export const archiveInboxItemResponseSchema = z.object({
  clip: ClipSchema,
});

const archiveInboxItemRouteBase = {
  method: 'post',
  path: '/users/me/inboxes/{itemId}/archive' as const,
  operationId: 'archiveMyInboxItem',
  description: '受信箱のアイテムをアーカイブに移動します',
  request: {
    params: archiveInboxItemRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: archiveInboxItemResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const archiveMyInboxItemRoute = createRoute(archiveInboxItemRouteBase);

export const archiveUserInboxItemRoute = createRoute(
  userIdPathRouteHelper(archiveInboxItemRouteBase),
);
