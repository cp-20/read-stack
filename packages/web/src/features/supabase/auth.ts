import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useAutoRedirect = (path: string) => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session) {
      router.push(path);
    }
  }, [path, router, session]);
};
