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
  clipId: z.string(),
});

export const deleteClipResponseSchema = z.object({
  clip: ClipSchema,
});

const deleteUserClipRouteBase: RouteConfig = {
  method: 'delete',
  path: '/users/me/clips/:clipId',
  request: {
    params: deleteClipRequestParamsSchema,
  },
  responses: {
    ...okJsonResponse({
      schema: deleteClipResponseSchema,
      example: {
        clip: {
          id: 1,
          status: 0,
          progress: 0,
          comment: 'This is a comment',
          articleId: 1,
          authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
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

export const deleteMyClipRoute = createRoute(deleteUserClipRouteBase);

export const deleteUserClipRoute = createRoute(
  userIdPathRouteHelper(deleteUserClipRouteBase),
);
