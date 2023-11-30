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

export const patchClipRequestParamsSchema = z.object({
  clipId: z.string(),
});

export const patchClipRequestBodySchema = z.object({
  clip: z
    .object({
      status: z.number().int().min(0).max(2),
      progress: z.number().int().min(0).max(100),
      comment: z.string(),
    })
    .partial(),
});

export const patchClipResponseSchema = z.object({
  clip: ClipSchema,
});

const patchUserClipRouteBase: RouteConfig = {
  method: 'patch',
  path: '/users/me/clips/:clipId',
  request: {
    params: patchClipRequestParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: patchClipRequestBodySchema,
          examples: {
            'update-status-and-progress': {
              clip: {
                status: 1,
                progress: 50,
              },
            },
            'update-comment': {
              clip: {
                comment: 'This is a comment',
              },
            },
            'make-clip-as-read': {
              clip: {
                status: 2,
                progress: 100,
              },
            },
            'make-clip-as-unread': {
              clip: {
                status: 0,
                progress: 0,
              },
            },
          },
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: patchClipResponseSchema,
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
          article: {
            id: 1,
            url: 'https://example.com',
            title: 'Example',
            description: 'This is an example',
            image: 'https://example.com/image.png',
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

export const patchMyClipRoute = createRoute(patchUserClipRouteBase);

export const patchUserClipRoute = createRoute(
  userIdPathRouteHelper(patchUserClipRouteBase),
);
