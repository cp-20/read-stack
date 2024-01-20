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

export const moveClipToInboxRequestParamsSchema = z.object({
  clipId: z.string().openapi({
    param: {
      name: 'clipId',
      in: 'path',
      required: true,
      description: 'クリップのID',
    },
    example: '1',
  }),
});

export const moveUserClipToInboxResponseSchema = z.object({
  item: InboxItemSchema,
});

const moveClipToInboxRouteBase = {
  method: 'post',
  path: '/users/me/clips/{clipId}/move-to-inbox' as const,
  operationId: 'moveMyClipToInbox',
  description: 'クリップを受信箱に移動します',
  request: {
    params: moveClipToInboxRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: moveUserClipToInboxResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const moveMyClipToInboxRoute = createRoute(moveClipToInboxRouteBase);

export const moveUserClipToInboxRoute = createRoute(
  userIdPathRouteHelper(moveClipToInboxRouteBase),
);
