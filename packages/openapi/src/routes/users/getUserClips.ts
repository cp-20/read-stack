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
  limit: z
    .string()
    .default('20')
    .openapi({
      param: {
        name: 'limit',
        in: 'query',
        required: false,
        description: '取得するクリップの数',
      },
      example: '20',
    }),
  unreadOnly: z
    .string()
    .default('true')
    .openapi({
      param: {
        name: 'unreadOnly',
        in: 'query',
        required: false,
        description: '未読のクリップのみ取得するかどうか',
      },
      example: 'true',
    }),
  cursor: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'cursor',
        in: 'query',
        required: false,
        description: '取得するクリップのカーソル (取得を開始するクリップのID)',
      },
      example: '1',
    }),
});

export const getClipsResponseSchema = z.object({
  clips: z.array(ClipWithArticleSchema),
  finished: z.boolean().openapi({
    description: 'これ以上取得できるクリップがないかどうか',
    example: false,
  }),
});

const getClipsRouteBase = {
  method: 'get',
  path: '/users/me/clips',
  description: 'クリップを取得します',
  request: {
    query: getClipsRequestQuerySchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getClipsResponseSchema,
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
