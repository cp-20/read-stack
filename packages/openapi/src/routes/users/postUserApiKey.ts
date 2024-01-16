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
  apiKey: z.string().openapi({
    description: 'APIキー',
    example: 'mskeuv73bn2vbc6396ngnbv7',
  }),
});

const postUserApiKeyRouteBase: RouteConfig = {
  method: 'post',
  path: '/users/me/api-keys' as const,
  description: 'APIキーを登録します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postUserApiKeyRequestBodySchema,
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
} satisfies RouteConfig;

export const postMyApiKeyRoute = createRoute(postUserApiKeyRouteBase);

export const postUserApiKeyRoute = createRoute(
  userIdPathRouteHelper(postUserApiKeyRouteBase),
);
