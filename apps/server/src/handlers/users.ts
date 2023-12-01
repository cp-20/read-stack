import type { OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteClipByIdAndAuthorId,
  findArticleByUrl,
  findUserAndCreateIfNotExists,
  saveArticleByUrl,
  saveClip,
  updateClipByIdAndAuthorId,
  findClipById,
  findClipsByUserIdOrderByUpdatedAt,
} from '@read-stack/database';
import { fetchArticle, parseIntWithDefaultValue } from '@read-stack/lib';
import {
  deleteMyClipRoute,
  getMeRoute,
  getMyClipRoute,
  getMyClipsRoute,
  patchClipRequestBodySchema,
  patchMyClipRoute,
  postClipRequestBodySchema,
  postMyClipRoute,
} from '@read-stack/openapi';

import { parseBody } from '@/handlers/helpers/parseBody';
import { getUser } from '@/handlers/helpers/getUser';

export const registerUsersHandlers = (app: OpenAPIHono) => {
  app.openapi(getMeRoute, async (c) => {
    const user = await getUser(c);
    if (user === null) return c.json({ user: null }, 401);

    // GitHub用になってるから良い感じにヘルパー関数書いて一般化する
    const userInfo = await findUserAndCreateIfNotExists({
      id: user.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- たぶん大丈夫
      email: user.email!,
      name: user.user_metadata.preferred_username as string,
      displayName: user.user_metadata.full_name as string,
      avatarUrl: user.user_metadata.avatar_url as string,
    });

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
        authorId: user.id,
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
          authorId: user.id,
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
        authorId: user.id,
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
    if (clip === undefined || clip.authorId !== user.id) {
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

    const updatedClip = await updateClipByIdAndAuthorId(clipId, user.id, clip);
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

    const deletedClip = await deleteClipByIdAndAuthorId(clipId, user.id);

    if (deletedClip === null) {
      return c.json({ error: 'clip not found' }, 404);
    }

    return c.json({ clip: deletedClip }, 200);
  });
};