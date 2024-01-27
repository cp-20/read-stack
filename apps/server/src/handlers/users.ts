import {
  createApiKey,
  createUserRss,
  deleteApiKey,
  deleteClipByIdAndUserId,
  deleteInboxItemByIdAndUserId,
  deleteUserRss,
  findArticleById,
  findArticleByUrl,
  findClipById,
  findClipsByUserIdAndReadStatus,
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
  deleteMyRssRoute,
  deleteUserRssRequestBodySchema,
  getClipsRequestQuerySchema,
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
import type { WithSupabaseClient } from '@/middleware/supabase';
import { parseSearchQuery } from '@/handlers/helpers/parseSearchQuery';

export const registerUsersHandlers = (app: WithSupabaseClient) => {
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
    if (user === null) return c.json({}, 401);

    const readStatusStr = c.req.query('readStatus');
    const readStatus =
      getClipsRequestQuerySchema.shape.readStatus.parse(readStatusStr);

    const { query, success, message } = parseSearchQuery({
      limit: c.req.query('limit'),
      offset: c.req.query('offset'),
      before: c.req.query('before'),
      after: c.req.query('after'),
    });

    if (!success) {
      return c.json({ error: message }, 400);
    }

    const selectedClips = await findClipsByUserIdAndReadStatus(
      user.id,
      { ...query, limit: query.limit + 1 },
      readStatus,
      c.req.query('text'),
      c.req.query('url'),
    );

    const clips = selectedClips.map((clip) => ({
      ...clip.clip,
      article: clip.article,
    }));

    return c.json(
      {
        clips: clips.slice(0, query.limit),
        finished: clips.length <= query.limit,
      },
      200,
    );
  });

  app.openapi(postMyClipRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({}, 401);

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
    if (user === null) return c.json({}, 401);

    const clipIdStr = c.req.param('clipId');
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
    if (user === null) return c.json({}, 401);

    const clipIdStr = c.req.param('clipId');
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
    if (user === null) return c.json({}, 401);

    const clipIdStr = c.req.param('clipId');
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
    if (user === null) return c.json({}, 401);

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
    if (user === null) return c.json({}, 401);

    await deleteApiKey(user.id);

    return c.json({}, 200);
  });

  app.openapi(getMyRssRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({}, 401);

    const rssList = await getUserRssItems(user.id);

    return c.json({ rss: rssList }, 200);
  });

  app.openapi(postMyRssRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({}, 401);

    const body = await parseBody(c, postRssRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    const newRss = await createUserRss(user.id, body.url, body.name);

    return c.json({ rss: newRss }, 200);
  });

  app.openapi(deleteMyRssRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({}, 401);

    const body = await parseBody(c, deleteUserRssRequestBodySchema);
    if (body === null) return c.json({ error: 'invalid body' }, 400);

    const deletedRss = await deleteUserRss(user.id, body.url);

    if (deletedRss === null) {
      return c.json({ error: 'rss not found' }, 404);
    }

    return c.json({ rss: deletedRss }, 200);
  });

  app.openapi(getMyInboxItemsRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({}, 401);

    const { query, success, message } = parseSearchQuery({
      limit: c.req.query('limit'),
      offset: c.req.query('offset'),
      before: c.req.query('before'),
      after: c.req.query('after'),
    });

    if (!success) {
      return c.json({ error: message }, 400);
    }

    const selectedItems = await findInboxItemsByUserId(
      user.id,
      {
        ...query,
        limit: query.limit + 1,
      },
      c.req.query('text'),
      c.req.query('url'),
    );

    const items = selectedItems.map((item) => ({
      ...item.item,
      article: item.article,
    }));

    return c.json(
      {
        items: items.slice(0, query.limit),
        finished: items.length <= query.limit,
      },
      200,
    );
  });

  app.openapi(getMyInboxItemRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({}, 401);

    const itemIdStr = c.req.param('itemId');
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
    if (user === null) return c.json({}, 401);

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
    if (user === null) return c.json({}, 401);

    const itemIdStr = c.req.param('itemId');
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
    if (user === null) return c.json({}, 401);

    const itemIdStr = c.req.param('itemId');
    const itemId = parseIntWithDefaultValue(itemIdStr, null);

    if (itemId === null) {
      return c.json({ error: 'itemId is not configured and valid' }, 400);
    }

    const item = await findInboxItemById(itemId);
    if (item === undefined || item.userId !== user.id) {
      return c.json({ error: 'item not found' }, 404);
    }

    const { clip } = await saveClip(item.articleId, user.id, () => ({
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
    if (user === null) return c.json({}, 401);

    const clipIdStr = c.req.param('clipId');
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
