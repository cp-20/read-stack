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
  offset: z.string().openapi({
    param: {
      name: 'offset',
      in: 'query',
      required: false,
      description: '取得するクリップのオフセット',
    },
    example: '0',
  }),
  before: z.string().openapi({
    param: {
      name: 'before',
      in: 'query',
      required: false,
      description: '取得するクリップの作成日時の上限',
    },
    example: '2021-01-01T00:00:00.000Z',
  }),
  after: z.string().openapi({
    param: {
      name: 'after',
      in: 'query',
      required: false,
      description: '取得するクリップの作成日時の下限',
    },
    example: '2021-01-01T00:00:00.000Z',
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
