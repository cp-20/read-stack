import type {
  ResponseConfig,
  ZodMediaTypeObject,
} from '@asteasolutions/zod-to-openapi';

type Response = {
  [statusCode: number]: ResponseConfig;
};

export const okResponse = (config?: Partial<ResponseConfig>): Response => ({
  200: {
    description: 'OK',
    ...config,
  },
});

export const okJsonResponse = (
  content: ZodMediaTypeObject,
  config?: Partial<ResponseConfig>,
): Response => ({
  200: {
    description: 'OK',
    content: {
      ...config?.content,
      'application/json': content,
    },
    ...config,
  },
});

export const badRequestResponse = (
  config?: Partial<ResponseConfig>,
): Response => ({
  400: {
    description: 'Bad Request',
    ...config,
  },
});

export const unauthorizedResponse = (
  config?: Partial<ResponseConfig>,
): Response => ({
  401: {
    description: 'Unauthorized',
    ...config,
  },
});

export const forbiddenResponse = (
  config?: Partial<ResponseConfig>,
): Response => ({
  403: {
    description: 'Forbidden',
    ...config,
  },
});

export const notFoundResponse = (
  config?: Partial<ResponseConfig>,
): Response => ({
  404: {
    description: 'Not Found',
    ...config,
  },
});

export const internalServerErrorResponse = (
  config?: Partial<ResponseConfig>,
): Response => ({
  500: {
    description: 'Internal Server Error',
    ...config,
  },
});
