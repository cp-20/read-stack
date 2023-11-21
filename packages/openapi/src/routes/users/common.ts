import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { forbiddenResponse } from '@openapi/routes/helpers/response';
import type { AnyZodObject } from 'zod';
import { z } from 'zod';
export const userIdRequestParamsSchema = z.object({
  userId: z.string(),
});

const mergeUserIdRequestParamsSchema = <T extends AnyZodObject>(schema: T) =>
  userIdRequestParamsSchema.merge(schema);

const mergeRequestParamsSchema = <T extends AnyZodObject>(schema?: T) =>
  (schema
    ? mergeUserIdRequestParamsSchema(schema)
    : userIdRequestParamsSchema) as T extends undefined
    ? typeof userIdRequestParamsSchema
    : typeof mergeUserIdRequestParamsSchema<T>;

type UserIdPathRouterHelper = <T extends RouteConfig>(
  config: T,
) => T & {
  request: [T['request']] extends [{ params: infer U }]
    ? U & {
        params: [U] extends [{ params: infer V }]
          ? V extends AnyZodObject
            ? ReturnType<typeof mergeRequestParamsSchema<V>>
            : never
          : never;
      }
    : Omit<T['request'], 'params'> & {
        params: typeof userIdRequestParamsSchema;
      };
};

export const userIdPathRouteHelper: UserIdPathRouterHelper = (config) =>
  ({
    ...config,
    path: config.path.replace(/^\/users\/me/, '/users/:userId'),
    request: {
      ...config.request,
      params: mergeRequestParamsSchema(config.request?.params),
    },
    responses: {
      ...config.responses,
      ...forbiddenResponse(),
    },
  } satisfies RouteConfig);
