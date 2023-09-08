import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { fetchArticle } from '@/features/articles/fetchArticle';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';
import { saveArticleByUrl } from '@/server/repository/article';
import { saveClip } from '@/server/repository/clip';

const postUserClipsSchema = z.object({
  id: z.string(),
});

const postUserClipsBodySchema = z.union([
  z.object({
    type: z.literal('id').optional(),
    articleId: z.number().int(),
  }),
  z.object({
    type: z.literal('url'),
    articleUrl: z.string().url(),
  }),
]);

export const postUserClips: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = postUserClipsSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }

    const body = postUserClipsBodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ error: body.error });
    }

    const { id: authorId } = query.data;

    const { type } = body.data;

    const articleId = await (async () => {
      if (type === 'id' || type === undefined) {
        return body.data.articleId;
      }

      if (type === 'url') {
        const { articleUrl } = body.data;
        const { article } = await saveArticleByUrl(articleUrl, () =>
          fetchArticle(articleUrl),
        );
        return article.id;
      }

      const _: never = type;
      return _;
    })();

    const { exist, clip } = await saveClip(articleId, authorId, () => ({
      articleId,
      authorId,
      progress: 0,
      status: 0,
    }));

    const status = exist ? 200 : 201;

    return res.status(status).json(clip);
  },
);
