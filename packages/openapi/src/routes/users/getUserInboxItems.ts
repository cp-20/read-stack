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
import { InboxItemWithArticleSchema } from '@/schema';

export const getInboxItemsRequestQuerySchema = z
  .object({
    url: z.string().openapi({
      param: {
        name: 'url',
        in: 'query',
        required: false,
        description: '記事のURL',
      },
      example: 'https://example.com',
    }),
    text: z.string().openapi({
      param: {
        name: 'text',
        in: 'query',
        required: false,
        description: '記事の検索クエリ',
      },
      example: 'TypeScript',
    }),
    limit: z
      .string()
      .default('20')
      .openapi({
        param: {
          name: 'limit',
          in: 'query',
          required: false,
          description: '取得するアイテムの数',
        },
        example: '20',
      }),
    offset: z.string().openapi({
      param: {
        name: 'offset',
        in: 'query',
        required: false,
        description: '取得するアイテムのオフセット',
      },
      example: '20',
    }),
    before: z.string().openapi({
      param: {
        name: 'before',
        in: 'query',
        required: false,
        description: '取得するアイテムの作成日時の上限',
      },
      example: '2021-01-01T00:00:00.000Z',
    }),
    after: z.string().openapi({
      param: {
        name: 'after',
        in: 'query',
        required: false,
        description: '取得するアイテムの作成日時の下限',
      },
      example: '2021-01-01T00:00:00.000Z',
    }),
  })
  .partial();

export const getInboxItemsResponseSchema = z.object({
  items: z.array(InboxItemWithArticleSchema),
  finished: z.boolean().openapi({
    description: 'これ以上取得できるアイテムがないかどうか',
    example: false,
  }),
});

const getInboxItemsRouteBase = {
  method: 'get',
  path: '/users/me/inboxes' as const,
  operationId: 'getMyInboxItems',
  description: '受信箱のアイテムの一覧を取得します',
  request: {
    query: getInboxItemsRequestQuerySchema,
  },
  responses: {
    ...okJsonResponse({
      schema: getInboxItemsResponseSchema,
    }),
    ...badRequestResponse(),
    ...unauthorizedResponse(),
    ...notFoundResponse(),
    ...internalServerErrorResponse(),
  },
} satisfies RouteConfig;

export const getMyInboxItemsRoute = createRoute(getInboxItemsRouteBase);

export const getUserInboxItemsRoute = createRoute(
  userIdPathRouteHelper(getInboxItemsRouteBase),
);
