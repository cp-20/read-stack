import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { forbiddenResponse } from '@/routes/helpers/response';

export const userIdRequestParamsSchema = z.object({
  userId: z.string(),
});

// const mergeUserIdRequestParamsSchema = <T extends AnyZodObject>(schema: T) =>
//   userIdRequestParamsSchema.merge(schema);

// const mergeRequestParamsSchema = <T extends AnyZodObject>(schema?: T) =>
//   (schema
//     ? mergeUserIdRequestParamsSchema(schema)
//     : userIdRequestParamsSchema) as T extends undefined
//     ? typeof userIdRequestParamsSchema
//     : typeof mergeUserIdRequestParamsSchema<T>;

// type UserIdPathRouterHelper = <T extends RouteConfig>(
//   config: T,
// ) => T & {
//   request: [T['request']] extends [{ params: infer U }]
//     ? U & {
//         params: [U] extends [{ params: infer V }]
//           ? V extends AnyZodObject
//             ? ReturnType<typeof mergeRequestParamsSchema<V>>
//             : never
//           : never;
//       }
//     : Omit<T['request'], 'params'> & {
//         params: typeof userIdRequestParamsSchema;
//       };
// };

export const userIdPathRouteHelper = (config: RouteConfig): RouteConfig =>
  ({
    ...config,
    path: config.path.replace(/^\/users\/me/, '/users/:userId'),
    request: {
      ...config.request,
      params: config.request?.params
        ? userIdRequestParamsSchema.merge(config.request.params)
        : userIdRequestParamsSchema,
    },
    responses: {
      ...config.responses,
      ...forbiddenResponse(),
    },
  }) satisfies RouteConfig;
