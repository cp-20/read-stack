import type { FC } from 'react';

import { AuthHeading } from './_components/AuthHeading';
import { AuthLayout } from './_components/AuthLayout';
import { AuthWithGitHubButton } from './_components/AuthWithGitHubButton';
import { useAutoRedirectIfLoggedIn } from '@/features/supabase/auth';

export const Login: FC = () => {
  useAutoRedirectIfLoggedIn('/home');

  return (
    <AuthLayout>
      <AuthHeading>ログイン</AuthHeading>
      <AuthWithGitHubButton />
    </AuthLayout>
  );
};
