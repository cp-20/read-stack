import type { OpenAPIHono } from '@hono/zod-openapi';
import {
  createApiKey,
  createUserRss,
  deleteApiKey,
  deleteClipByIdAndUserId,
  deleteInboxItemByIdAndUserId,
  findArticleById,
  findArticleByUrl,
  findClipById,
  findClipsByUserIdOrderByCreatedAt,
  findInboxItemById,
  findInboxItemsByUserId,
  findUserAndCreateIfNotExists,
  getUserRssItems,
  saveArticleByUrl,
  saveClip,
  saveInboxItem,
  updateClipByIdAndUserId,
} from '@read-stack/database';
import { fetchArticle, parseIntWithDefaultValue } from '@read-stack/lib';
import {
  deleteMyApiKeyRoute,
  deleteMyClipRoute,
  deleteMyInboxItemRoute,
  getMeRoute,
  getMyClipRoute,
  getMyClipsRoute,
  getMyInboxItemRoute,
  getMyInboxItemsRoute,
  getMyRssRoute,
  moveMyClipToInboxRoute,
  moveMyInboxItemToClipRoute,
  patchClipRequestBodySchema,
  patchMyClipRoute,
  postClipRequestBodySchema,
  postInboxItemRequestBodySchema,
  postMyApiKeyRoute,
  postMyClipRoute,
  postMyInboxItemRoute,
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

    const { clips, finished } = await findClipsByUserIdOrderByCreatedAt(
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

  app.openapi(getMyInboxItemsRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const limitStr = c.req.query('limit');
    const limit = parseIntWithDefaultValue(limitStr, 20);
    const offsetStr = c.req.query('offset');
    const offset = parseIntWithDefaultValue(offsetStr, undefined);
    const beforeStr = c.req.query('before');
    const before = beforeStr !== undefined ? new Date(beforeStr) : undefined;
    const afterStr = c.req.query('after');
    const after = afterStr !== undefined ? new Date(afterStr) : undefined;

    if (limit > 100) {
      return c.json({ error: 'limit must be equal or less than 100' }, 400);
    }

    if (limit < 0) {
      return c.json({ error: 'limit must be equal or greater than 0' }, 400);
    }

    if (offset !== undefined && offset < 0) {
      return c.json({ error: 'offset must be equal or greater than 0' }, 400);
    }

    if (before !== undefined && after !== undefined && before < after) {
      return c.json(
        { error: 'before must be equal or greater than after' },
        400,
      );
    }

    const inboxItems = await findInboxItemsByUserId(user.id, {
      limit: limit + 1,
      offset,
      before,
      after,
    });

    return c.json(
      {
        items: inboxItems.slice(0, limit),
        finished: limit <= inboxItems.length,
      },
      200,
    );
  });

  app.openapi(getMyInboxItemRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const itemIdStr = c.req.query('itemId');
    const itemId = parseIntWithDefaultValue(itemIdStr, null);
    if (itemId === null) {
      return c.json({ error: 'itemId is required' }, 400);
    }

    const inboxItem = await findInboxItemById(itemId);
    if (inboxItem === undefined || inboxItem.userId !== user.id) {
      return c.json({ error: 'inbox item not found' }, 404);
    }

    return c.json({ item: inboxItem }, 200);
  });

  app.openapi(postMyInboxItemRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const body = await parseBody(c, postInboxItemRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    if (body.type === 'id' || body.type === undefined) {
      const { articleId } = body;
      const item = await saveInboxItem({
        articleId,
        userId: user.id,
      });

      const article = await findArticleById(item.articleId);

      return c.json({ item: { ...item, article } }, 200);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- あえて
    if (body.type === 'url') {
      const { articleUrl } = body;

      const article = await findArticleByUrl(articleUrl);

      if (article !== undefined) {
        const item = await saveInboxItem({
          articleId: article.id,
          userId: user.id,
        });

        return c.json({ item: { ...item, article } }, 200);
      }

      const newArticle = await fetchArticle(articleUrl);
      if (newArticle === null) {
        return c.json({ error: 'article not found' }, 400);
      }

      const savedArticle = await saveArticleByUrl(articleUrl, () => newArticle);

      const item = await saveInboxItem({
        articleId: savedArticle.id,
        userId: user.id,
      });

      return c.json({ item: { ...item, article: savedArticle } }, 200);
    }

    const _: never = body.type;
    return _;
  });

  app.openapi(deleteMyInboxItemRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const itemIdStr = c.req.query('itemId');
    const itemId = parseIntWithDefaultValue(itemIdStr, null);

    if (itemId === null) {
      return c.json({ error: 'itemId is not configured and valid' }, 400);
    }

    const item = await deleteInboxItemByIdAndUserId(itemId, user.id);

    if (item === undefined) {
      return c.json({ error: 'item not found' }, 404);
    }

    return c.json({ item }, 200);
  });

  app.openapi(moveMyInboxItemToClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const itemIdStr = c.req.query('itemId');
    const itemId = parseIntWithDefaultValue(itemIdStr, null);

    if (itemId === null) {
      return c.json({ error: 'itemId is not configured and valid' }, 400);
    }

    const item = await findInboxItemById(itemId);
    if (item === undefined || item.userId !== user.id) {
      return c.json({ error: 'item not found' }, 404);
    }

    const clip = await saveClip(item.articleId, user.id, () => ({
      articleId: item.articleId,
      userId: user.id,
      progress: 0,
      status: 0,
    }));

    await deleteInboxItemByIdAndUserId(itemId, user.id);

    return c.json({ clip }, 200);
  });

  app.openapi(moveMyClipToInboxRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    const clipIdStr = c.req.query('clipId');
    const clipId = parseIntWithDefaultValue(clipIdStr, null);

    if (clipId === null) {
      return c.json({ error: 'clipId is not configured and valid' }, 400);
    }

    const clip = await findClipById(clipId);
    if (clip === undefined || clip.userId !== user.id) {
      return c.json({ error: 'clip not found' }, 404);
    }

    const item = await saveInboxItem({
      articleId: clip.articleId,
      userId: user.id,
    });

    await deleteClipByIdAndUserId(clipId, user.id);

    return c.json({ item }, 200);
  });
};
