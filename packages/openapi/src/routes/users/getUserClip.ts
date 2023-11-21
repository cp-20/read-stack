import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okJsonResponse,
  unauthorizedResponse,
} from '@openapi/routes/helpers/response';
import { userIdPathRouteHelper } from '@openapi/routes/users/common';
import { ClipSchema } from '@openapi/schema';
import { z } from 'zod';

export const getUserClipRequestParamsSchema = z.object({
  clipId: z.string(),
});

export const getUserClipResponseSchema = z.object({
  clip: ClipSchema,
});

export const getUserClipRouteBase: RouteConfig = {
  method: 'get',
  path: '/users/me/clips/:clipId',
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
};

export const getMyClipRoute = createRoute(getUserClipRouteBase);

export const getUserClipRoute = createRoute(
  userIdPathRouteHelper(getUserClipRouteBase),
);
