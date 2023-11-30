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

export const getClipsRequestQuerySchema = z.object({
  // limit: z.number().int().min(1).max(100).default(20),
  // unreadOnly: z.boolean().default(true),
  // cursor: z.number().int().optional(),
  limit: z.string().default('20'),
  unreadOnly: z.string().default('true'),
  cursor: z.string().optional(),
});

export const getClipsResponseSchema = z.object({
  clips: z.array(ClipWithArticleSchema),
  finished: z.boolean(),
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
          {
            id: 2,
            status: 1,
            progress: 70,
            articleId: 2,
            authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
            createdAt: '2023-11-15T09:05:15.452Z',
            updatedAt: '2023-11-15T09:05:15.452Z',
            article: {
              id: 2,
              url: 'https://example.com',
              title: 'This is a title',
              body: 'This is a body',
              ogImageUrl: null,
              summary: null,
              createdAt: '2023-11-15T09:05:15.452Z',
              updatedAt: '2023-11-15T09:05:15.452Z',
            },
          },
          {
            id: 3,
            status: 2,
            progress: 100,
            articleId: 3,
            authorId: '99d09600-f420-4ceb-91d3-19a7662eaed6',
            createdAt: '2023-11-15T09:05:15.452Z',
            updatedAt: '2023-11-15T09:05:15.452Z',
            article: {
              id: 3,
              url: 'https://example.com',
              title: 'This is a title',
              body: 'This is a body',
              ogImageUrl: null,
              summary: null,
              createdAt: '2023-11-15T09:05:15.452Z',
              updatedAt: '2023-11-15T09:05:15.452Z',
            },
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
