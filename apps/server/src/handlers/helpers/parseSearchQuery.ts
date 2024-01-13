import { parseIntWithDefaultValue } from '@read-stack/lib';

interface RawSearchQuery {
  limit: string | undefined;
  offset: string | undefined;
  before: string | undefined;
  after: string | undefined;
}

interface SuccessParsedSearchQuery {
  query: {
    limit: number;
    offset: number;
    before: Date | undefined;
    after: Date | undefined;
  };
  success: true;
  message: undefined;
}

interface FailedParsedSearchQuery {
  query: null;
  success: false;
  message: string;
}

export type ParsedSearchQuery =
  | SuccessParsedSearchQuery
  | FailedParsedSearchQuery;

export const parseSearchQuery = (query: RawSearchQuery): ParsedSearchQuery => {
  const { limit, offset, before, after } = query;
  const parsedQuery = {
    limit: parseIntWithDefaultValue(limit, 20),
    offset: parseIntWithDefaultValue(offset, 0),
    before: before !== undefined ? new Date(before) : undefined,
    after: after !== undefined ? new Date(after) : undefined,
  };

  if (parsedQuery.limit < 0) {
    return { query: null, success: false, message: 'limit must be positive' };
  }

  if (parsedQuery.limit > 100) {
    return {
      query: null,
      success: false,
      message: 'limit must be less than or equal to 100',
    };
  }

  if (parsedQuery.offset < 0) {
    return { query: null, success: false, message: 'offset must be positive' };
  }

  if (parsedQuery.offset > 10000) {
    return {
      query: null,
      success: false,
      message: 'offset must be less than or equal to 10000',
    };
  }

  if (parsedQuery.before !== undefined && isNaN(parsedQuery.before.getTime())) {
    return {
      query: null,
      success: false,
      message: 'before must be a valid date',
    };
  }

  if (parsedQuery.after !== undefined && isNaN(parsedQuery.after.getTime())) {
    return {
      query: null,
      success: false,
      message: 'after must be a valid date',
    };
  }

  if (
    parsedQuery.before !== undefined &&
    parsedQuery.after !== undefined &&
    parsedQuery.before.getTime() < parsedQuery.after.getTime()
  ) {
    return {
      query: null,
      success: false,
      message: 'before must be after after',
    };
  }

  return { query: parsedQuery, success: true, message: undefined };
};
