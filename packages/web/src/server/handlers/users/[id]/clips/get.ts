import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { prisma } from '@/features/database/prismaClient';
import { ClipSearchQuerySchema } from '@/schema/clipSearchQuery';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';
import { parseInt } from '@/shared/lib/parseInt';

const getUserClipsSchema = z.object({
  id: z.string(),
  query: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.string().optional(),
});

// TODO: ページング処理をいい感じに抽象化する
export const getUserClips: NextApiHandler = requireAuthWithUserMiddleware()(
  async (req, res) => {
    const query = getUserClipsSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }
    const { id } = query.data;
    const cursor = parseInt(query.data.cursor, -1);
    const limit = parseInt(query.data.limit, 20);
    const searchQuery = ClipSearchQuerySchema.safeParse(
      JSON.parse(query.data.query ?? '{}'),
    );
    if (!searchQuery.success) {
      return res.status(400).json({ error: searchQuery.error });
    }

    const cursorOption = cursor !== -1 ? { cursor: { id: cursor } } : undefined;

    const queryOption = {
      ...(searchQuery.data.unreadOnly
        ? {
            status: {
              in: [0, 1],
            },
          }
        : undefined),
      // bodyとtitleも一応使えるけど、日本語検索が怪しい
      ...(searchQuery.data.body
        ? { article: { body: { contains: searchQuery.data.body } } }
        : undefined),
      ...(searchQuery.data.title
        ? { article: { title: { contains: searchQuery.data.title } } }
        : undefined),
    };

    const clips = await prisma.clips.findMany({
      where: {
        authorId: id,
        AND: {
          ...queryOption,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        article: true,
      },
      ...cursorOption,
      take: Math.min(100, limit),
      skip: cursor !== -1 ? 1 : 0,
    });

    return res.status(200).json({ clips });
  },
);
