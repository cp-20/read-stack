import { fetcher } from '@/features/swr/fetcher';
import type { getUserResponseSchema } from '@read-stack/openapi';
import useSWR from 'swr';
import type { z } from 'zod';

type GetMeResponse = z.infer<typeof getUserResponseSchema>;

export const useUser = () => {
  const { data, error } = useSWR<GetMeResponse>('/api/v1/users/me', fetcher);

  return { user: data?.user, error };
};
