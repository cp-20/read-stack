import { fetcher } from '@/features/swr/fetcher';
import type { getUserResponseSchema } from '@read-stack/openapi';
import useImmutableSWR from 'swr/immutable';
import type { z } from 'zod';

type GetMeResponse = z.infer<typeof getUserResponseSchema>;

export const useUser = () => {
  const { data, error } = useImmutableSWR<GetMeResponse>(
    '/api/v1/users/me',
    fetcher,
    {},
  );

  return { user: data?.user, error };
};
