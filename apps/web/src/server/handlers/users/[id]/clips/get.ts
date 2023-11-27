import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { db } from '@/features/database/drizzleClient';
import { ClipSearchQuerySchema } from '@/schema/clipSearchQuery';
import { requireAuthWithUserMiddleware } from '@/server/middlewares/authorize';
import { excludeFalsy } from '@/shared/lib/excludeFalsy';
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

    const cursorTimestamp =
      cursor !== -1
        ? (
            await db.query.clips.findFirst({
              columns: {
                updatedAt: true,
              },
              where: (fields, { and, eq }) =>
                and(eq(fields.authorId, id), eq(fields.id, cursor)),
            })
          )?.updatedAt
        : undefined;

    const clips = await db.query.clips.findMany({
      where: (fields, { and, inArray, lt, eq }) => {
        const filters = excludeFalsy([
          searchQuery.data.unreadOnly && inArray(fields.status, [0, 1]),
          cursorTimestamp !== undefined &&
            lt(fields.updatedAt, cursorTimestamp),
        ]);
        return and(eq(fields.authorId, id), ...filters);
      },
      orderBy: (clips, { desc }) => desc(clips.updatedAt),
      // ...cursorOption,
      limit: Math.min(100, limit),
      offset: cursor !== -1 ? 1 : 0,
      with: {
        article: true,
      },
    });

    return res.status(200).json({ clips });
  },
);
