import { useSession, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

export const useAutoRedirectIfLoggedIn = (path: string) => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session) {
      void router.push(path);
    }
  }, [path, router, session]);
};

export const useAutoRedirectIfNotLoggedIn = (path: string) => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      void router.push(path);
    }
  }, [path, router, session]);
};

export const useUserData = () => {
  const user = useUser();
  const userData = useSWR('/api/v1/users/me');

  return { user, userData };
};
