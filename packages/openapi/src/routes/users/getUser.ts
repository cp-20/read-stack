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
import { UserSchema } from '@/schema';

export const getUserResponseSchema = z.object({
  user: UserSchema,
});

const getUserRouteBase = {
  method: 'get',
  path: '/users/me' as const,
  description: '自分の情報を取得します',
  responses: {
    ...okJsonResponse({
      schema: UserSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const getMeRoute = createRoute(getUserRouteBase);

export const getUserRoute = createRoute(
  userIdPathRouteHelper(getUserRouteBase),
);
