import type { FC } from 'react';
import { useAutoRedirectIfLoggedIn } from '@/features/supabase/auth';
import { AuthHeading } from './_components/AuthHeading';
import { AuthLayout } from './_components/AuthLayout';
import { AuthWithGitHubButton } from './_components/AuthWithGitHubButton';

export const Signup: FC = () => {
  useAutoRedirectIfLoggedIn('/home');

  return (
    <AuthLayout>
      {/* デザインが簡素過ぎてうーん */}
      <AuthHeading>アカウント登録</AuthHeading>

      <AuthWithGitHubButton />
    </AuthLayout>
  );
};
