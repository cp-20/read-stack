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
  clipId: z.string().openapi({
    param: {
      name: 'clipId',
      in: 'path',
      required: true,
      description: '更新するクリップのID',
    },
    example: '1',
  }),
});

export const patchClipRequestBodySchema = z.object({
  clip: z
    .object({
      status: z.number().int().min(0).max(2).openapi({
        description: 'クリップの状態 (0: 未読, 1: 読み中, 2: 読了)',
        example: 1,
      }),
      progress: z.number().int().min(0).max(100).openapi({
        description: 'クリップの読了率 (0 ~ 100)',
        example: 50,
      }),
      comment: z.string().openapi({
        description: 'クリップに対するコメント',
        example: 'コメント',
      }),
    })
    .partial()
    .openapi({
      description: '更新するクリップの情報',
      example: {
        status: 1,
        progress: 50,
        comment: 'コメント',
      },
    }),
});

export const patchClipResponseSchema = z.object({
  clip: ClipSchema,
});

const patchUserClipRouteBase = {
  method: 'patch',
  path: '/users/me/clips/{clipId}' as const,
  operationId: 'patchMyClip',
  description: 'クリップを更新します',
  request: {
    params: patchClipRequestParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: patchClipRequestBodySchema,
        },
      },
    },
  },
  responses: {
    ...okJsonResponse({
      schema: patchClipResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const patchMyClipRoute = createRoute(patchUserClipRouteBase);

export const patchUserClipRoute = createRoute(
  userIdPathRouteHelper(patchUserClipRouteBase),
);
