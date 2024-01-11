import type { OpenAPIHono } from '@hono/zod-openapi';
import {
  createApiKey,
  createUserRss,
  deleteApiKey,
  deleteClipByIdAndUserId,
  findArticleByUrl,
  findClipById,
  findClipsByUserIdOrderByUpdatedAt,
  findUserAndCreateIfNotExists,
  getUserRssItems,
  saveArticleByUrl,
  saveClip,
  updateClipByIdAndUserId,
} from '@read-stack/database';
import { fetchArticle, parseIntWithDefaultValue } from '@read-stack/lib';
import {
  deleteMyApiKeyRoute,
  deleteMyClipRoute,
  getMeRoute,
  getMyClipRoute,
  getMyClipsRoute,
  getMyRssRoute,
  patchClipRequestBodySchema,
  patchMyClipRoute,
  postClipRequestBodySchema,
  postMyApiKeyRoute,
  postMyClipRoute,
  postMyRssRoute,
  postRssRequestBodySchema,
  postUserApiKeyRequestBodySchema,
} from '@read-stack/openapi';

import { extractUserInfoFromSupabase } from '@/handlers/helpers/extractUserInfoFromSupabase';
import { getUser } from '@/handlers/helpers/getUser';
import { parseBody } from '@/handlers/helpers/parseBody';
import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';

export const registerUsersHandlers = (
  app: OpenAPIHono<{ Variables: SupabaseMiddlewareVariable }>,
) => {
  app.openapi(getMeRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    if (user.authType === 'apiKey') {
      const { authType: _, ...userInfo } = user;
      return c.json({ user: userInfo }, 200);
    }

    const userInfo = await findUserAndCreateIfNotExists(
      extractUserInfoFromSupabase(user),
    );

    if (userInfo === null) {
      return c.json({ user: null }, 404);
    }

    return c.json({ user: userInfo }, 200);
  });

  app.openapi(getMyClipsRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const limitStr = c.req.query('limit');
    const limit = parseIntWithDefaultValue(limitStr, 20);
    const unreadOnlyStr = c.req.query('unreadOnly');
    const unreadOnly =
      unreadOnlyStr === undefined ? true : unreadOnlyStr !== 'false';
    const cursorStr = c.req.query('cursor');
    const cursor = parseIntWithDefaultValue(cursorStr, undefined);

    const { clips, finished } = await findClipsByUserIdOrderByUpdatedAt(
      user.id,
      limit,
      unreadOnly,
      cursor,
    );

    return c.json({ clips, finished }, 200);
  });

  app.openapi(postMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const body = await parseBody(c, postClipRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    const { type } = body;

    if (type === 'id' || type === undefined) {
      const { articleId } = body;
      const clip = await saveClip(articleId, user.id, () => ({
        articleId,
        userId: user.id,
        progress: 0,
        status: 0,
      }));

      return c.json({ clip }, 200);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- これやらないとtype narrowingがうまく行かない
    if (type === 'url') {
      const { articleUrl } = body;

      const article = await findArticleByUrl(articleUrl);

      if (article !== undefined) {
        const { clip } = await saveClip(article.id, user.id, () => ({
          articleId: article.id,
          userId: user.id,
          progress: 0,
          status: 0,
        }));

        return c.json({ clip: { ...clip, article } }, 200);
      }

      const newArticle = await fetchArticle(articleUrl);
      if (newArticle === null) {
        return c.json({ error: 'article not found' }, 400);
      }

      const savedArticle = await saveArticleByUrl(articleUrl, () => newArticle);

      const { clip } = await saveClip(savedArticle.id, user.id, () => ({
        articleId: savedArticle.id,
        userId: user.id,
        progress: 0,
        status: 0,
      }));

      return c.json({ clip: { ...clip, article: savedArticle } }, 200);
    }

    const _: never = type;
    return _;
  });

  app.openapi(getMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const clipIdStr = c.req.query('clipId');
    const clipId = parseIntWithDefaultValue(clipIdStr, null);
    if (clipId === null) {
      return c.json({ error: 'clipId is required' }, 400);
    }

    const clip = await findClipById(clipId);
    if (clip === undefined || clip.userId !== user.id) {
      return c.json({ error: 'clip not found' }, 404);
    }

    return c.json({ clip }, 200);
  });

  app.openapi(patchMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const clipIdStr = c.req.query('clipId');
    const clipId = parseIntWithDefaultValue(clipIdStr, null);
    if (clipId === null) {
      return c.json({ error: 'clipId is required' }, 400);
    }

    const body = await parseBody(c, patchClipRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    const { clip } = body;

    const updatedClip = await updateClipByIdAndUserId(clipId, user.id, clip);
    if (updatedClip === null) {
      return c.json({ error: 'clip not found' }, 404);
    }

    return c.json({ clip: updatedClip }, 200);
  });

  app.openapi(deleteMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const clipIdStr = c.req.query('clipId');
    const clipId = parseIntWithDefaultValue(clipIdStr, null);
    if (clipId === null) {
      return c.json({ error: 'clipId is not configured and valid' }, 400);
    }

    const deletedClip = await deleteClipByIdAndUserId(clipId, user.id);

    if (deletedClip === null) {
      return c.json({ error: 'clip not found' }, 404);
    }

    return c.json({ clip: deletedClip }, 200);
  });

  app.openapi(postMyApiKeyRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const body = await parseBody(c, postUserApiKeyRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    const { apiKey } = body;
    // TODO: ここのBunへの依存をなくしたい (でrepositoryに入れたい)
    const hashedApiKey = Bun.hash(apiKey).toString();

    await createApiKey(user.id, hashedApiKey);

    return c.json({}, 200);
  });

  app.openapi(deleteMyApiKeyRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    await deleteApiKey(user.id);

    return c.json({}, 200);
  });

  app.openapi(getMyRssRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const rssList = await getUserRssItems(user.id);

    return c.json({ rss: rssList }, 200);
  });

  app.openapi(postMyRssRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const body = await parseBody(c, postRssRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    const newRss = await createUserRss(user.id, body.url, body.name);

    return c.json({ rss: newRss }, 200);
  });
};
