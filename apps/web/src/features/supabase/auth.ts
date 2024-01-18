import { useSupabase } from '@/features/supabase/supabaseClient';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

export const useAutoRedirectIfLoggedIn = (path: string) => {
  const router = useRouter();
  const session = useSession();
  const { supabaseClient } = useSupabase();

  useEffect(() => {
    if (!session) return;

    if (session.expires_at && session.expires_at < Date.now()) {
      void router.push(path);
      return;
    }

    void supabaseClient.auth.refreshSession().then((res) => {
      if (res.error) return;

      void router.push(path);
    });
  }, [path, router, session, supabaseClient.auth]);
};

export const useAutoRedirectIfNotLoggedIn = (path: string) => {
  const router = useRouter();
  const session = useSession();
  const { supabaseClient } = useSupabase();

  useEffect(() => {
    if (!session) {
      void router.push(path);
      return;
    }

    if (!session.expires_at || session.expires_at >= Date.now()) {
      void supabaseClient.auth.refreshSession();
    }
  }, [path, router, session, supabaseClient.auth]);
};

export const useUserData = () => {
  const user = useUser();
  const userData = useSWR('/api/v1/users/me');

  return { user, userData };
};
