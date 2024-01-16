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
import { ClipWithArticleSchema } from '@/schema';

export const getUserClipRequestParamsSchema = z.object({
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

export const getUserClipResponseSchema = z.object({
  clip: ClipWithArticleSchema,
});

export const getUserClipRouteBase = {
  method: 'get',
  path: '/users/me/clips/:clipId' as const,
  description: 'クリップを取得します',
  request: {
    params: getUserClipRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getUserClipResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const getMyClipRoute = createRoute(getUserClipRouteBase);

export const getUserClipRoute = createRoute(
  userIdPathRouteHelper(getUserClipRouteBase),
);
