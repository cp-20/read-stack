import { app } from '.';

// eslint-disable-next-line import/no-default-export -- for Bun server
export default {
  port: 8000,
  fetch: app.fetch,
};
