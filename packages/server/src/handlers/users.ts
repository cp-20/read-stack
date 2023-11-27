import { findUserById } from '@database';
import type { OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteMyClipRoute,
  getMeRoute,
  getMyClipRoute,
  getMyClipsRoute,
  patchMyClipRoute,
  postMyClipRoute,
} from '@openapi';
import { getUser } from '@server/handlers/helpers/getUser';
import { findClipsByUserIdOrderByUpdatedAt } from '@server/repositories/clip';

export const registerUsersHandlers = (app: OpenAPIHono) => {
  app.openapi(getMeRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const userInfo = await findUserById(user.id);

    if (userInfo === null) {
      return c.json({ user: null }, 404);
    }

    return c.json({ user: userInfo }, 200);
  });

  app.openapi(getMyClipsRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const limitStr = c.req.query('limit');
    const limit = limitStr === undefined ? 20 : parseInt(limitStr, 10);
    const unreadOnlyStr = c.req.query('unreadOnly');
    const unreadOnly =
      unreadOnlyStr === undefined ? true : unreadOnlyStr !== 'false';
    const cursorStr = c.req.query('cursor');
    const cursor =
      cursorStr === undefined ? undefined : parseInt(cursorStr, 10);

    const { clips, hasMore } = await findClipsByUserIdOrderByUpdatedAt(
      user.id,
      limit,
      unreadOnly,
      cursor,
    );

    return c.json({ clips, hasMore }, 200);
  });

  app.openapi(postMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);
  });

  app.openapi(getMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);
  });

  app.openapi(patchMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);
  });

  app.openapi(deleteMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);
  });
};
