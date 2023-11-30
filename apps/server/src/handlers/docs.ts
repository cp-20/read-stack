import type { OpenAPIHono } from '@hono/zod-openapi';

export const registerDocsHandler = (app: OpenAPIHono) => {
  app.doc('/openapi', {
    openapi: '3.0.0',
    info: {
      version: '0.0.0',
      title: 'ReadStack API',
    },
  });
};
