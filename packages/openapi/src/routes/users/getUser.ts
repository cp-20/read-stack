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

const getUserRouteBase: RouteConfig = {
  method: 'get',
  path: '/users/me',
  responses: {
    ...okJsonResponse({
      schema: UserSchema,
      example: {
        user: {
          id: '1',
          email: 'me@example.com',
          name: 'Me',
          displayName: 'Me',
          avatarUrl: 'https://example.com/me.jpg',
          createdAt: '2023-11-15T09:05:15.452Z',
          updatedAt: '2023-11-15T09:05:15.452Z',
        },
      },
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
};

export const getMeRoute = createRoute(getUserRouteBase);

export const getUserRoute = createRoute(
  userIdPathRouteHelper(getUserRouteBase),
);
