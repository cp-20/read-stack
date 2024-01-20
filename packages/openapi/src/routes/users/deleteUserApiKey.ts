import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { createRoute } from '@hono/zod-openapi';

import {
  internalServerErrorResponse,
  notFoundResponse,
  okResponse,
  unauthorizedResponse,
} from '@/routes/helpers/response';
import { userIdPathRouteHelper } from '@/routes/users/common';

const deleteUserApiKeyRouteBase = {
  method: 'delete',
  path: '/users/me/api-keys' as const,
  operationId: 'deleteMyApiKey',
  description: 'APIキーを削除します',
  responses: {
    ...okResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const deleteMyApiKeyRoute = createRoute(deleteUserApiKeyRouteBase);

export const deleteUserApiKeyRoute = createRoute(
  userIdPathRouteHelper(deleteUserApiKeyRouteBase),
);
