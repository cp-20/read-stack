import type { FC } from 'react';
import { useAutoRedirectIfLoggedIn } from '@/features/supabase/auth';
import { AuthHeading } from './_components/AuthHeading';
import { AuthLayout } from './_components/AuthLayout';
import { AuthWithGitHubButton } from './_components/AuthWithGitHubButton';

export const Login: FC = () => {
  useAutoRedirectIfLoggedIn('/home');

  return (
    <AuthLayout>
      <AuthHeading>ログイン</AuthHeading>
      <AuthWithGitHubButton />
    </AuthLayout>
  );
};
