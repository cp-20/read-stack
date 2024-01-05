import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { userIdPathRouteHelper } from '@/routes/users/common';

export const postUserApiKeyRequestBodySchema = z.object({
  apiKey: z.string(),
});

const postUserApiKeyRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/api-keys',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postUserApiKeyRequestBodySchema,
          example: {
            apiKey: '1234567890',
          },
        },
      },
    },
  },
  responses: {
    ...okResponse(),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
};

export const postMyApiKeyRoute = createRoute(postUserApiKeyRouteBase);

export const postUserApiKeyRoute = createRoute(
  userIdPathRouteHelper(postUserApiKeyRouteBase),
);
