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
import { UserSchema } from '@openapi/schema';
import { z } from 'zod';

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
          avatar: 'https://example.com/me.jpg',
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
