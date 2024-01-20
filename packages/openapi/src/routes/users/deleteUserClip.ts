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

export const deleteClipRequestParamsSchema = z.object({
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

export const deleteClipResponseSchema = z.object({
  clip: ClipSchema,
});

const deleteUserClipRouteBase = {
  method: 'delete',
  path: '/users/me/clips/:clipId' as const,
  operationId: 'deleteMyClip',
  description: 'クリップを削除します',
  request: {
    params: deleteClipRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: deleteClipResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const deleteMyClipRoute = createRoute(deleteUserClipRouteBase);

export const deleteUserClipRoute = createRoute(
  userIdPathRouteHelper(deleteUserClipRouteBase),
);
