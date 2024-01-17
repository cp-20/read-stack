import type { MiddlewareHandler } from 'hono';

import { logger } from '@/features/logger';

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = performance.now();

  const request = {
    method: c.req.method,
    path: c.req.path,
    param: c.req.param(),
    query: c.req.query(),
    body: c.req.json(),
  };
  logger.info({
    ...request,
  });

  try {
    await next();

    const response = {
      status: c.res.status,
      ms: performance.now() - start,
    };

    logger.info({
      ...request,
      ...response,
    });
  } catch (error) {
    logger.error({
      ...request,
      error,
    });
  }
};
