import { prometheus } from '@hono/prometheus';

export const {
  printMetrics: prometheusHandler,
  registerMetrics: prometheusMiddleware,
} = prometheus();
