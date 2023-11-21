import { findUserById } from '@database';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { getMeRoute } from '@openapi';
import { getUser } from '@server/handlers/helpers/getUser';

export const registerUsersHandlers = (app: OpenAPIHono) => {
  app.openapi(getMeRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const userInfo = await findUserById(user.id);

    if (userInfo === null) {
      return c.json({ user: null }, 404);
    }

    return c.json({ user }, 200);
  });

  // app.openapi(getMyClipsRoute, async (c) => {
  //   const user = await getUser(c);
  //   if (user === null) return c.json({ user: null }, 401);

  //   const limit = c.req.query('limit');
  //   const offset = c.req.query('offset');
  // });

  // app.openapi(postMyClipRoute, async (c) => {
  //   const user = await getUser(c);
  //   if (user === null) return c.json({ user: null }, 401);
  // });

  // app.openapi(getMyClipRoute, async (c) => {
  //   const user = await getUser(c);
  //   if (user === null) return c.json({ user: null }, 401);
  // });

  // app.openapi(patchMyClipRoute, async (c) => {
  //   const user = await getUser(c);
  //   if (user === null) return c.json({ user: null }, 401);
  // });

  // app.openapi(deleteMyClipRoute, async (c) => {
  //   const user = await getUser(c);
  //   if (user === null) return c.json({ user: null }, 401);
  // });
};
