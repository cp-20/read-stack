import { excludeFalsy } from '@read-stack/lib';
import { and, gt, lt } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const SearchQuerySchema = z.object({
  before: z.date().optional(),
  after: z.date().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

type TimeColumn = PgColumn<{
  name: string;
  tableName: string;
  dataType: 'date';
  columnType: 'PgTimestamp';
  data: Date;
  driverParam: string;
  notNull: boolean;
  hasDefault: boolean;
  enumValues: string[] | undefined;
}>;

export const convertSearchQuery =
  (timeColumn: TimeColumn, defaultLimit?: number) => (query: SearchQuery) => {
    const { before, after, limit: limitQuery, offset: offsetQuery } = query;

    const limit = limitQuery ?? defaultLimit ?? 20;
    const offset = offsetQuery ?? 0;
    const orderBy = timeColumn;

    const beforeCondition = before && lt(timeColumn, before);
    const afterCondition = after && gt(timeColumn, after);

    const condition = and(...excludeFalsy([beforeCondition, afterCondition]));

    const params = { limit, offset, orderBy };

    return { params, condition };
  };
