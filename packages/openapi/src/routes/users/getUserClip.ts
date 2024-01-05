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
  clipId: z.string(),
});

export const getUserClipResponseSchema = z.object({
  clip: ClipWithArticleSchema,
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
      example: {
        clip: {
          id: 1,
          status: 0,
          progress: 0,
          comment: 'This is a comment',
          articleId: 1,
          userId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
          createdAt: '2023-11-15T09:05:15.452Z',
          updatedAt: '2023-11-15T09:05:15.452Z',
          article: {
            id: 1,
            url: 'https://example.com',
            title: 'This is a title',
            body: 'This is a body',
            ogImageUrl: null,
            summary: null,
            createdAt: '2023-11-15T09:05:15.452Z',
            updatedAt: '2023-11-15T09:05:15.452Z',
          },
        },
      },
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
