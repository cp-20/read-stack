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

export const getClipsRequestQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const getClipsResponseSchema = z.object({
  clips: z.array(ClipSchema),
});

const getClipsRouteBase = {
  method: 'get',
  path: '/users/me/clips',
  request: {
    query: getClipsRequestQuerySchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getClipsResponseSchema,
      example: {
        clips: [
          {
            id: 1,
            status: 0,
            progress: 0,
            comment: 'This is a comment',
            articleId: 1,
            authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
            createdAt: '2023-11-15T09:05:15.452Z',
            updatedAt: '2023-11-15T09:05:15.452Z',
          },
          {
            id: 2,
            status: 1,
            progress: 70,
            articleId: 2,
            authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
            createdAt: '2023-11-15T09:05:15.452Z',
            updatedAt: '2023-11-15T09:05:15.452Z',
          },
          {
            id: 3,
            status: 2,
            progress: 100,
            articleId: 3,
            authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
            createdAt: '2023-11-15T09:05:15.452Z',
            updatedAt: '2023-11-15T09:05:15.452Z',
          },
        ],
      },
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const getMyClipsRoute = createRoute(getClipsRouteBase);

export const getUserClipsRoute = createRoute(
  userIdPathRouteHelper(getClipsRouteBase),
);
